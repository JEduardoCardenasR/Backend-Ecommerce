import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    //Recibir por headers el token:
    const token = request.headers.authorization?.split(' ')[1]; //Se obtiene un string con: Bearer xxxx (los divide y los pone en un array don de se obtiene lo que se encuentra en la posición una - el token)

    //Verificamos si no tenemos el token en cuyo caso lanzamos una excepción
    if (!token) throw new UnauthorizedException('Token required');

    //Si recibimos el token:
    try {
      //Validar token:
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });

      //Le cambiamos las propiedades
      payload.exp = new Date(payload.exp * 1000);
      payload.iat = new Date(payload.iat * 1000);

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
