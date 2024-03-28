import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const token = headers.authorization.split(' ')[1];

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      request.user = this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
