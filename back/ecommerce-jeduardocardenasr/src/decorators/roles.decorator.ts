import { SetMetadata } from '@nestjs/common';
import { Rol } from '../enums/roles.enum';

export const Roles = (...roles: Rol[]) => SetMetadata('roles', roles);
