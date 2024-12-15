import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLES_KEY } from "../decorators/role.decorator";
import { Users } from "src/users/users.schema";
import { Roles } from "../decorators/role.decorator";

type Role = string;

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Retrieve required roles from metadata
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If no roles are required, allow access
        if (!requiredRoles) {
            return true;
        }

        // Retrieve the request object
        const request = context.switchToHttp().getRequest<Request>();
        const user  = request.user as Users;

        // If no user is attached to the request, throw an error
        if (!user) {
            console.log(request)
            throw new UnauthorizedException('No user attached to the request');
        }

        const userRole = user.role;

        // Check if the user's role is included in the required roles
        if (!requiredRoles.includes(userRole)) {
            throw new UnauthorizedException('Unauthorized access: Insufficient role');
        }

        // If everything checks out, allow access
        return true;
    }
}
