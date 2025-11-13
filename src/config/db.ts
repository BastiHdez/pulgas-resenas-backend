import 'dotenv/config';
import { Pool, QueryResult } from 'pg';

// Interfaz para la configuración de la BD
interface DbConfig {
    host: string;
    port: number;
    user: string;
    password?: string;
    database: string;
}

// Función para obtener la configuración de forma segura
const getDbConfig = (): DbConfig => {
    const port = parseInt(process.env.PG_PORT || '5432');
    
    if (!process.env.PG_HOST || !process.env.PG_USER || !process.env.PG_DATABASE) {
        throw new Error('Error de configuración: Faltan variables PG_HOST, PG_USER o PG_DATABASE en el entorno.');
    }

    return {
        host: process.env.PG_HOST,
        port: port,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
    };
};

const config = getDbConfig();

// Crea el Pool de Conexiones
const pool = new Pool(config);

// Exporta la función para ejecutar consultas
export const query = (text: string, params: any[] = []): Promise<QueryResult<any>> => {
    return pool.query(text, params);
};

// Función para forzar y esperar la conexión (llamada desde index.ts)
export async function connectDb(): Promise<void> {
    try {
        const client = await pool.connect();
        console.log(`Conexión establecida a PostgreSQL en ${config.host}:${config.port}/${config.database}`);
        client.release();
    } catch (err) {
        // --- INICIO DE LA CORRECCIÓN TS2339 ---
        let errorDetails = "Error desconocido.";
        
        // Verificamos si es una instancia de Error para acceder a .stack o .message
        if (err instanceof Error) {
            errorDetails = err.stack || err.message;
        } else if (typeof err === 'string') {
            errorDetails = err;
        }

        console.error(`Error al conectar a PostgreSQL en ${config.host}:${config.port}:`, errorDetails);
        
        // Si la conexión falla al inicio, cerramos el proceso.
        process.exit(1);
        // --- FIN DE LA CORRECCIÓN ---
    }
}