import { Role } from '@prisma/client';
import { ID } from '../../domain/entities';

export interface JwtPayload {
  sub: ID;
  email: string;
  role: Role | null;
}
