import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar el middleware globalmente

  const loggerMiddleware = new LoggerMiddleware();
  app.use(loggerMiddleware.use.bind(loggerMiddleware));

  // Otra versión:
  // app.use((req, res, next) => new LoggerMiddleware().use(req, res, next));

  app.useGlobalPipes(new ValidationPipe());

  //Construcción del documento Open Api (Configuración)
  const openApiConfig = new DocumentBuilder()
    .setTitle('NestJS Api - Ecommerce FSPT23')
    .setDescription(
      'Integrative project for the backend specialization of module 4.',
    )
    .setVersion('1.0.0')
    .addBearerAuth() //Para acceder a la opción del token
    .build();

  //Creación del documento Open Api
  const document = SwaggerModule.createDocument(app, openApiConfig);

  //Setup Open Api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
