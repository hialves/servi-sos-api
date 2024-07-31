import { ExternalID, ID } from '../../domain/entities';
import { Admin } from '../../domain/entities/admin';
import { CreateAdminData } from '../../domain/valueobjects/create-admin-data';
import { Transaction } from '../../infra/persistence/prisma/prisma.interface';

export abstract class AdminRepository {
  abstract create(input: CreateAdminData, tx?: Transaction): Promise<Admin>;
  abstract findById(id: ID): Promise<Admin | null>;
  abstract findByExternalId(externalId: ExternalID): Promise<Admin | null>;
  abstract findByEmail(email: string): Promise<Admin | null>;
  abstract update(input: Admin): Promise<Admin>;
  abstract getByUserId(userId: ID): Promise<Admin | null>;
  abstract findByGoogleId(googleId: string): Promise<Admin | null>;
}
