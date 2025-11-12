// --- Archivo: src/index.ts ---

// AJUSTE CRÍTICO DE RUTA: Uso de './config/db' sin la extensión .ts
import { connectDb } from './config/db'; 
import { obtenerPromedioPuntuacion } from './services/puntuacionService';
import { crearResena } from './services/resenaService'; 

async function iniciarAplicacion() {
    console.log("--- Iniciando la aplicación ---");
    
    // 1. ESPERA LA CONEXIÓN
    // Esto llamará a la función de prueba en db.ts y esperará el resultado.
    await connectDb();
    
    console.log("El servidor está conectado, iniciando lógica principal...");
    
    // 2. LÓGICA DE PRUEBA
    const VENDEDOR_ID = 45;
    const COMPRADOR_ID = 10;

    try {
        // Creamos una nueva reseña para probar INSERT
        const nuevaResena = await crearResena({
            id_producto: 1,
            id_comprador: COMPRADOR_ID,
            id_vendedor: VENDEDOR_ID,
            comentario: "Test de conexión exitoso.",
            puntuacion: 5,
            nombre_comprador: "UserTest"
        });

        console.log(`\n🎉 Se creó una reseña: ${nuevaResena.id_resena}`);
        
        // Obtenemos el promedio para probar SELECT
        const promedio = await obtenerPromedioPuntuacion(VENDEDOR_ID);
        console.log(`El promedio de puntuación del vendedor ${VENDEDOR_ID} es: ${promedio}`);
        
    } catch (error) {
        // En lugar de que la aplicación falle completamente, capturamos errores de SQL aquí
        if (error instanceof Error) {
            console.error("\nError de SQL en la lógica principal:", error.message);
        } else {
            console.error("\nError desconocido en la lógica principal:", error);
        }
    }
}

// 3. INICIO DE LA APLICACIÓN
iniciarAplicacion();