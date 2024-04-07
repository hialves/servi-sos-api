import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../presentation/decorators/roles.decorator';
import { Request } from 'express';
import ms from 'ms';
import { Role } from '@prisma/client';
import { cacheKeys } from '../../../application/cache/cache-keys';
import { CacheServiceImpl } from '../../frameworks/cache/cache.service';
import { UserRepository } from '../../../application/repositories/user-repository.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
    private cache: CacheServiceImpl,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest() as Request;
    const session = request.session;

    if (session?.userId) {
      const key = cacheKeys.session.userById(session?.userId);
      const user = await this.cache.getAndSave(key, () => this.userRepository.findById(session?.userId), ms('1hour'));
      if (!user) return false;
      if (user.role === Role.super_admin) return true;

      return requiredRoles.some((role) => user.role === role);
    }

    return false;
  }
}
