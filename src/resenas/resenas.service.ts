import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from '../resena.entity';
import { CreateResenaDto } from './dto/create-resena.dto';
import { RateOnlyDto } from './dto/rate-only.dto';
import { VotoResena } from '../voto-resena.entity';

@Injectable()
export class ResenasService {
  constructor(
    @InjectRepository(Resena) private readonly resenaRepo: Repository<Resena>,
    @InjectRepository(VotoResena) private readonly votoRepo: Repository<VotoResena>,
  ) {}

  // ---------------------------
  // Helpers
  // ---------------------------
  private sanitizeComment(s?: string | null) {
    const t = (s ?? '').trim();
    if (!t) return null;
    return t.length > 500 ? t.slice(0, 500) : t;
  }

  private handlePgError(e: any): never {
    const code = e?.code;
    if (code === '23505') { // unique_violation
      throw new ConflictException('Ya existe una reseña para este producto y comprador.');
    }
    if (code === '22P02') { // invalid_text_representation (UUID mal formado, etc.)
      throw new BadRequestException('Formato inválido (revisa IDs/UUIDs).');
    }
    if (code === '23503') { // foreign_key_violation
      throw new BadRequestException('Referencia inválida (FK).');
    }
    throw new BadRequestException(e?.detail || e?.message || 'Error de solicitud.');
  }

  // ---------------------------
  // UPSERT centralizado
  // ---------------------------
  /** Si existe reseña para (productId + idComprador) => ACTUALIZA, si no => CREA */
  private async upsertReview(
    productId: number,
    payload: {
      idComprador: number;
      idVendedor: number;
      nombreComprador: string;
      puntuacion: number;         // 1..5
      comentario?: string | null; // opcional
    },
  ) {
    const existing = await this.resenaRepo.findOne({
      where: { idProducto: productId, idComprador: payload.idComprador },
    });

    const comentario = this.sanitizeComment(payload.comentario);

    if (existing) {
      existing.puntuacion = payload.puntuacion;
      existing.comentario = comentario; // puede ser null (comentario opcional)
      existing.nombreComprador = payload.nombreComprador;
      existing.idVendedor = payload.idVendedor;

      const saved = await this.resenaRepo.save(existing);
      return { idResena: saved.idResena, action: 'updated' as const };
    } else {
      const entity = this.resenaRepo.create({
        idProducto: productId,
        idComprador: payload.idComprador,
        idVendedor: payload.idVendedor,
        nombreComprador: payload.nombreComprador,
        puntuacion: payload.puntuacion,
        comentario,
      });
      const saved = await this.resenaRepo.save(entity);
      return { idResena: saved.idResena, action: 'created' as const };
    }
  }

  // ---------------------------
  // Endpoints que llaman al UPSERT
  // ---------------------------

  /** Puntuar (con o sin comentario): usa upsert para no duplicar */
  async rateProduct(productId: number, dto: RateOnlyDto) {
    try {
      return await this.upsertReview(productId, {
        idComprador: dto.idComprador,
        idVendedor: dto.idVendedor,
        nombreComprador: dto.nombreComprador,
        puntuacion: dto.puntuacion,
        comentario: dto.comentario ?? null, // comentario OPCIONAL
      });
    } catch (e) {
      this.handlePgError(e);
    }
  }

  /** Crear reseña (alias semántico de rateProduct) */
  async createResena(productId: number, dto: CreateResenaDto) {
    try {
      return await this.upsertReview(productId, {
        idComprador: dto.idComprador,
        idVendedor: dto.idVendedor,
        nombreComprador: dto.nombreComprador,
        puntuacion: dto.puntuacion,
        comentario: dto.comentario ?? null, // comentario OPCIONAL
      });
    } catch (e) {
      this.handlePgError(e);
    }
  }

  /** Eliminar reseña por producto y comprador */
  async deleteResena(productId: number, idComprador: number) {
    try {
      const result = await this.resenaRepo.delete({
        idProducto: productId,
        idComprador: idComprador,
      });

      if (result.affected === 0) {
        throw new NotFoundException(`No se encontró reseña para el producto ${productId} y comprador ${idComprador}.`);
      }

      // TypeORM en cascada debería eliminar también los votos asociados (si se configuró bien en la entidad)
      return { productId, idComprador, action: 'deleted', affected: result.affected };
    } catch (e) {
      // Reutiliza el manejo de errores si son de DB.
      // Si es un NotFoundException, se lanza directamente.
      if (e instanceof NotFoundException) {
        throw e;
      }
      this.handlePgError(e);
    }
  }

  // ---------------------------
  // Consultas
  // ---------------------------

  /** Promedio y cantidad de reseñas por producto */
  async average(productId: number) {
    const row = await this.resenaRepo.createQueryBuilder('r')
      .select('COALESCE(AVG(r.puntuacion), 0)', 'avg')
      .addSelect('COUNT(*)', 'cnt')
      .where('r.idProducto = :pid', { pid: productId })
      .getRawOne<{ avg: string; cnt: string }>();

    const average = Number(row?.avg ?? 0);
    const count   = Number(row?.cnt ?? 0);

    return { productId, average, count };
  }

  /** Listar reseñas + conteo de votos 👍/👎 con paginación */
  async listByProduct(
    productId: number,
    opts?: { limit?: number; offset?: number }
  ) {
    const limit = Math.min(opts?.limit ?? 10, 50);
    const offset = Math.max(opts?.offset ?? 0, 0);

    // Trae reseñas paginadas
    const [resenas, total] = await this.resenaRepo.createQueryBuilder('r')
      .where('r.idProducto = :pid', { pid: productId })
      .orderBy('r.fechaResena', 'DESC')
      .limit(limit)
      .offset(offset)
      .getManyAndCount();

    if (resenas.length === 0) {
      return { items: [], total, limit, offset };
    }

    // Junta votos por reseña
    const ids = resenas.map(r => r.idResena);
    const votos = await this.votoRepo.createQueryBuilder('v')
      .select('v.idResena', 'id')
      .addSelect("SUM(CASE WHEN v.voto = true THEN 1 ELSE 0 END)", 'up')
      .addSelect("SUM(CASE WHEN v.voto = false THEN 1 ELSE 0 END)", 'down')
      .where('v.idResena IN (:...ids)', { ids })
      .groupBy('v.idResena')
      .getRawMany<{ id: string; up: string; down: string }>();

    const map = new Map(votos.map(v => [v.id, { up: Number(v.up), down: Number(v.down) }]));

    return {
      items: resenas.map(r => ({
        idResena: r.idResena,
        comentario: r.comentario,
        puntuacion: r.puntuacion,
        fecha: r.fechaResena,
        idComprador: r.idComprador,
        nombreComprador: r.nombreComprador,
        votos: map.get(r.idResena) || { up: 0, down: 0 },
      })),
      total,
      limit,
      offset,
    };
  }
}
