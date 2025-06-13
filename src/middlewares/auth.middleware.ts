import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Permissions } from './decorators/permissions.decorator';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector:Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.replace('Bearer ','');
      const permissions = this.reflector.get(Permissions, context.getHandler())?? [];
      if (token == null) {
        throw new UnauthorizedException('El token no existe');
      }
      for (const permission of permissions) {
        const response = await axios.get(`http://localhost:3001/can-do/${permission}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });}
      return true
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }
}
