import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar el middleware globalmente

  const loggerMiddleware = new LoggerMiddleware();
  app.use(loggerMiddleware.use.bind(loggerMiddleware));

  // app.use((req, res, next) => new LoggerMiddleware().use(req, res, next));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
