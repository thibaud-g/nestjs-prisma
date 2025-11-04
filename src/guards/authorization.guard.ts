import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'prisma/prisma.service';
import { ROLES_KEY } from 'src/decorators/role.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    if (!request.user?.userId) {
      throw new ForbiddenException('Missing authenticated user');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: request.user.userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('User does not exist');
    }

    const role = user.role;

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    return true;
  }
}
