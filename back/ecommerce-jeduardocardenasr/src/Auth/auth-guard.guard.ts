import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

function validate(request) {
  const authHeader = request.headers.authorization;

  // if (!authHeader) return false;

  if (!authHeader) {
    throw new UnauthorizedException('¡El header de autorización no existe!');
  }

  const [email, password] = authHeader.split(':');

  // if (!email || !password) return false;

  if (!email || !password) {
    throw new UnauthorizedException('¡Credenciales inválidas!');
  }
  return true;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validate(request);
  }
}
