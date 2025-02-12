import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          typeof data === 'object' &&
          data.users &&
          Array.isArray(data.users)
        ) {
          // Si la respuesta es un objeto con un array de usuarios, excluimos `password` de cada usuario
          const usersWithoutPassword = data.users.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ password, ...rest }) => rest,
          );
          return {
            ...data,
            users: usersWithoutPassword,
          };
        } else if (Array.isArray(data)) {
          // Si la respuesta es un array, excluimos `password` de cada usuario
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return data.map(({ password, ...rest }) => rest);
        } else if (typeof data === 'object' && data !== null) {
          // Si la respuesta es un objeto único, excluimos `password`
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...rest } = data;
          return rest;
        }
        return data; // Si la respuesta no es un objeto o array, la dejamos intacta
      }),
    );
  }
}
