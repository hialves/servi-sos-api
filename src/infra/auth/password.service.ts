import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordService as IPasswordService } from '../../application/interfaces/password-service.interface';

@Injectable()
export class PasswordService implements IPasswordService {
  constructor(private saltRounds: number) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
