import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePuntuacionDto } from './dto/create-puntuacion.dto';
import { UpdatePuntuacionDto } from './dto/update-puntuacion.dto';
import { QueryPuntuacionesDto } from './dto/query-puntuaciones.dto';

/**
 * Servicio de Puntuaciones
 * Nota: Implementación en memoria para que compile y funcione de inmediato.
 * Reemplaza más adelante con tu persistencia real (TypeORM/Prisma/etc.).
 */
type Puntuacion = {
  id_puntuacion: number;
  vendedorId: number;
  id_comprador: number;
  puntuacion: number; // 1..5
  comentario?: string;
  fecha_creacion: Date;
};

@Injectable()
export class PuntuacionesService {
  private seq = 1;
  private store = new Map<number, Puntuacion[]>(); // key: vendedorId

  private getBucket(vendedorId: number): Puntuacion[] {
    if (!this.store.has(vendedorId)) this.store.set(vendedorId, []);
    return this.store.get(vendedorId)!;
  }

  crear(vendedorId: number, dto: CreatePuntuacionDto) {
    const now = new Date();
    const item: Puntuacion = {
      id_puntuacion: this.seq++,
      vendedorId,
      id_comprador: (dto as any).id_comprador,
      puntuacion: (dto as any).puntuacion,
      comentario: (dto as any).comentario,
      fecha_creacion: now,
    };
    this.getBucket(vendedorId).push(item);
    return item;
  }

  listar(vendedorId: number, query: QueryPuntuacionesDto) {
    const bucket = this.getBucket(vendedorId).slice();

    // Filtros básicos si existen en el DTO
    let data = bucket;
    if ((query as any).puntuacion) {
      data = data.filter((p) => p.puntuacion === Number((query as any).puntuacion));
    }
    if ((query as any).id_comprador) {
      data = data.filter((p) => p.id_comprador === Number((query as any).id_comprador));
    }

    // Orden por fecha reciente primero
    data.sort((a, b) => b.fecha_creacion.getTime() - a.fecha_creacion.getTime());

    // Paginación
    const page = Number((query as any).page ?? 1);
    const limit = Number((query as any).limit ?? 20);
    const total = data.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: data.slice(start, end),
      meta: { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  obtenerUno(vendedorId: number, id_puntuacion: number) {
    const bucket = this.getBucket(vendedorId);
    const found = bucket.find((p) => p.id_puntuacion === id_puntuacion);
    if (!found) throw new NotFoundException('Puntuación no encontrada');
    return found;
  }

    async listarPorVendedor(vendedorId: number, query: QueryPuntuacionesDto) {
    // TODO: implement real fetching / pagination / filtering
    const { limit = 10, offset = 0 } = (query as any) || {};
    return {
      data: [], // replace with fetched puntuaciones for vendedorId
      count: 0,
      limit,
      offset,
    };
  } 
  
  actualizar(vendedorId: number, id_puntuacion: number, dto: UpdatePuntuacionDto) {
    const bucket = this.getBucket(vendedorId);
    const idx = bucket.findIndex((p) => p.id_puntuacion === id_puntuacion);
    if (idx === -1) throw new NotFoundException('Puntuación no encontrada');

    const prev = bucket[idx];
    const next: Puntuacion = {
      ...prev,
      ...dto as any,
    };
    // Evitar cambiar vendedorId/id_puntuacion/fecha_creacion
    next.vendedorId = prev.vendedorId;
    next.id_puntuacion = prev.id_puntuacion;
    next.fecha_creacion = prev.fecha_creacion;

    bucket[idx] = next;
    return next;
  }

  eliminar(vendedorId: number, id_puntuacion: number) {
    const bucket = this.getBucket(vendedorId);
    const idx = bucket.findIndex((p) => p.id_puntuacion === id_puntuacion);
    if (idx === -1) throw new NotFoundException('Puntuación no encontrada');
    const [removed] = bucket.splice(idx, 1);
    return { ok: true, eliminado: removed.id_puntuacion };
  }

  /**
   * Retorna promedio, conteo y distribución (1..5) de las puntuaciones del vendedor.
   */
  obtenerRating(vendedorId: number) {
    const bucket = this.getBucket(vendedorId);
    const total = bucket.length;
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;

    for (const p of bucket) {
      if (p.puntuacion >= 1 && p.puntuacion <= 5) dist[p.puntuacion]++;
    }

    const sum = bucket.reduce((acc, p) => acc + (p.puntuacion || 0), 0);
    const promedio = total ? Number((sum / total).toFixed(2)) : 0;

    return {
      vendedorId,
      total,
      promedio,
      distribucion: dist,
    };
  }
}
