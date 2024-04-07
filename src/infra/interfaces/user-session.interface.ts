import { Role } from '@prisma/client';
import { ID } from '../../domain/entities';

export interface UserSession {
  userId: ID;
  email: string;
  role: Role | null;
}
