import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (útil para el front en 3000)
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' });

  // Puerto desde .env (por defecto 3001) y bind a 0.0.0.0
  const port = Number(process.env.PORT || 3001);
  await app.listen(port, '0.0.0.0');

  console.log(`API escuchando en http://localhost:${port}`);
}
bootstrap();
