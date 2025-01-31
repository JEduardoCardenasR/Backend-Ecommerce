import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

function validate(request) {
  const authHeader = request.headers.authorization;

  if (!authHeader) return false;

  const [email, password] = authHeader.split(':');

  if (!email || !password) return false;

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
