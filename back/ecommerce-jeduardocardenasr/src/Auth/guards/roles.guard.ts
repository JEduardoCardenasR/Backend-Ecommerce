import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Rol } from '../../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} //Reflector permite acceder a la metadata de la solicitud
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const hasRol = () =>
      requiredRoles.some((rol) => user?.roles?.includes(rol));

    const valid = user && user.roles && hasRol();

    if (!valid) {
      throw new ForbiddenException(
        'You do not have permission to access this content',
      );
    }
    return valid;
  }
}
