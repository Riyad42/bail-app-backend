import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get<string>('role', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!requiredRole) return true;

        if (!user || user.role !== requiredRole) {
            throw new ForbiddenException('Accès refusé : réservé aux administrateurs.');
        }

        return true;
    }
}
