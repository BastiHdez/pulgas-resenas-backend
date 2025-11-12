import { query } from '../config/db';
import { QueryResult } from 'pg';

// Interfaz para la tabla puntuacion
export interface Puntuacion {
    id_puntuacion: string; // uuid
    id_vendedor: number; // bigint
    id_comprador: number; // bigint
    puntuacion: number; // integer (CHECK: 1-5)
}

// 1. Función para registrar una nueva puntuación
export async function registrarPuntuacion(data: Omit<Puntuacion, 'id_puntuacion'>): Promise<Puntuacion> {
    const text = `
        INSERT INTO public.puntuacion (id_vendedor, id_comprador, puntuacion)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [data.id_vendedor, data.id_comprador, data.puntuacion];

    try {
        const result: QueryResult<Puntuacion> = await query(text, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error al registrar puntuación:', error);
        throw new Error('Fallo al insertar la puntuación del vendedor.');
    }
}

// 2. Función para obtener el promedio de puntuación de un vendedor
export async function obtenerPromedioPuntuacion(idVendedor: number): Promise<number | null> {
    const text = `
        SELECT AVG(puntuacion) AS promedio
        FROM public.puntuacion
        WHERE id_vendedor = $1;
    `;
    const values = [idVendedor];

    try {
        const result: QueryResult<{ promedio: string }> = await query(text, values);
        
        // PostgreSQL retorna AVG como string; lo convertimos a número flotante
        const promedio = parseFloat(result.rows[0]?.promedio);
        
        // Retorna el promedio o null si no hay puntuaciones
        return isNaN(promedio) ? null : promedio;
    } catch (error) {
        console.error('Error al obtener promedio de puntuación:', error);
        throw new Error('Fallo al calcular el promedio.');
    }
}