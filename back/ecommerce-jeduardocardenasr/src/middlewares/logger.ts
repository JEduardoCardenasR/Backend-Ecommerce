import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const date = new Date();

    const day = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; //El padStart es para que el número vaya con 0
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    console.log(
      `You are executing the ${req.method} method on the ${req.originalUrl} route on ${day} at ${time}`,
    );

    next();
  }
}
