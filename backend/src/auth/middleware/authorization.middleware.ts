import { UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { role: string }; 
}

const isUserAuthorized = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Check if the user exists and has a valid role
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizedException('User does not have the required role');
    }
    next(); // Proceed to the next middleware
  };
};

export default isUserAuthorized;
