import { ExternalID, ID } from '../../domain/entities';
import { User } from '../../domain/entities/user';

export abstract class UserRepository {
  abstract findById(id: ID): Promise<User | null>;
  abstract findByExternalId(externalId: ExternalID): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByRecoverPasswordToken(recoverPasswordToken: string): Promise<User | null>;
  abstract update(input: User): Promise<User>;
}
