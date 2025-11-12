import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { QueryResenasDto } from './dto/query-resenas.dto';

/**
 * Servicio de Reseñas (resenas)
 * Implementación en memoria para que el proyecto compile y puedas probar de inmediato.
 * Sustituye luego por tu capa de persistencia (TypeORM/Prisma) sin cambiar las firmas.
 */
type Resena = {
  id_resena: number;
  productoId: number;
  id_comprador: number;
  id_vendedor: number;
  calificacion: number; // 1..5
  comentario?: string;
  fecha_creacion: Date;
};

@Injectable()
export class ResenasService {
  private seq = 1;
  private store = new Map<number, Resena[]>(); // key: productoId

  private bucket(productoId: number): Resena[] {
    if (!this.store.has(productoId)) this.store.set(productoId, []);
    return this.store.get(productoId)!;
  }

  crear(productoId: number, dto: CreateResenaDto) {
    const now = new Date();
    const item: Resena = {
      id_resena: this.seq++,
      productoId,
      id_comprador: (dto as any).id_comprador,
      id_vendedor: (dto as any).id_vendedor,
      calificacion: (dto as any).calificacion,
      comentario: (dto as any).comentario,
      fecha_creacion: now,
    };
    this.bucket(productoId).push(item);
    return item;
  }

  listar(productoId: number, query: QueryResenasDto) {
    let data = this.bucket(productoId).slice();

    // Filtros por calificación
    const { calificacion, calificacion_min, calificacion_max } = (query as any);
    if (calificacion) {
      data = data.filter(r => r.calificacion === Number(calificacion));
    }
    if (calificacion_min) {
      data = data.filter(r => r.calificacion >= Number(calificacion_min));
    }
    if (calificacion_max) {
      data = data.filter(r => r.calificacion <= Number(calificacion_max));
    }

    // Ordenar por recientes primero
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

  obtenerUno(productoId: number, id_resena: number) {
    const item = this.bucket(productoId).find(r => r.id_resena === id_resena);
    if (!item) throw new NotFoundException('Reseña no encontrada');
    return item;
  }

  actualizar(productoId: number, id_resena: number, dto: UpdateResenaDto) {
    const list = this.bucket(productoId);
    const idx = list.findIndex(r => r.id_resena === id_resena);
    if (idx === -1) throw new NotFoundException('Reseña no encontrada');

    const prev = list[idx];
    const next: Resena = { ...prev, ...(dto as any) };

    // Campos protegidos
    next.id_resena = prev.id_resena;
    next.productoId = prev.productoId;
    next.fecha_creacion = prev.fecha_creacion;

    list[idx] = next;
    return next;
  }

  eliminar(productoId: number, id_resena: number) {
    const list = this.bucket(productoId);
    const idx = list.findIndex(r => r.id_resena === id_resena);
    if (idx === -1) throw new NotFoundException('Reseña no encontrada');
    const [removed] = list.splice(idx, 1);
    return { ok: true, eliminado: removed.id_resena };
  }
}
