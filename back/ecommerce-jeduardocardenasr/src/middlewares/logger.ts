import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const fechaHora = new Date().toISOString(); // Fecha y hora en formato ISO
    console.log(
      `Estás ejecutando el método ${req.method} en la ruta ${req.originalUrl} a la fecha y hora: ${fechaHora}`,
    );

    next();
  }
}
