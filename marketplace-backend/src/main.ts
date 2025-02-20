import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: ['https://magic-log-marketplace-eight.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Permitir cookies y autenticación
  });

  // Escuchar en el puerto indicado o en el puerto 3000 por defecto
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
