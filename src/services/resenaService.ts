import { query } from '../config/db';
import { QueryResult } from 'pg';

// Interfaz para la tabla resena
export interface Resena {
    id_resena: string; 
    id_producto: number; 
    id_comprador: number; 
    id_vendedor: number; 
    comentario: string | null; 
    puntuacion: number; 
    fecha_resena: Date; 
    nombre_comprador: string; 
}

// Función para insertar una nueva reseña
export async function crearResena(resena: Omit<Resena, 'id_resena' | 'fecha_resena'>): Promise<Resena> {
    const text = `
        INSERT INTO public.resena (id_producto, id_comprador, id_vendedor, comentario, puntuacion, nombre_comprador)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [
        resena.id_producto,
        resena.id_comprador,
        resena.id_vendedor,
        resena.comentario,
        resena.puntuacion,
        resena.nombre_comprador
    ];

    const result: QueryResult<Resena> = await query(text, values);
    return result.rows[0];
}

// Función para obtener todas las reseñas de un producto
export async function obtenerResenasPorProducto(idProducto: number): Promise<Resena[]> {
    const text = `
        SELECT * FROM public.resena 
        WHERE id_producto = $1
        ORDER BY fecha_resena DESC;
    `;
    const values = [idProducto];

    const result: QueryResult<Resena> = await query(text, values);
    return result.rows;
}