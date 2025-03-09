import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Si `exceptionResponse` es un objeto, extraemos solo el mensaje
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Unexpected error';

      response.status(status).json({
        statusCode: status,
        message,
      });
    } else {
      console.error('Unexpected error:', exception);

      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error. Please try again later.',
      });
    }
  }
}
