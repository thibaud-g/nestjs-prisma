import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'prisma/prisma.service';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/role.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = await this.prismaService.user.findUnique({
      where: {
        id: request.user.userId,
      },
    });

    if (!user) {
      return false;
    }

    const role = user.role;

    if (!requiredRoles.includes(role)) {
      return false;
    }
    return true;
  }
}
