import { Role } from '@prisma/client';
import dayjs from 'dayjs';
import { ExternalID, ID } from '.';

export interface UserFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  password: string | null;
  email: string;
  recoverPasswordToken: string | null;
  recoverPasswordTokenExpire: Date | null;
  googleToken: string | null;
  role: Role | null;
  lastLogin: Date | null;
  externalId: ExternalID;
}

export class User implements UserFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  password: string | null;
  email: string;
  recoverPasswordToken: string | null;
  recoverPasswordTokenExpire: Date | null;
  googleToken: string | null;
  role: Role | null;
  lastLogin: Date | null;
  externalId: ExternalID;

  constructor(input: UserFields) {
    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.password = input.password;
    this.email = input.email;
    this.recoverPasswordToken = input.recoverPasswordToken;
    this.recoverPasswordTokenExpire = input.recoverPasswordTokenExpire;
    this.googleToken = input.googleToken;
    this.role = input.role;
    this.lastLogin = input.lastLogin;
    this.externalId = input.externalId;
  }

  setLastLogin() {
    this.lastLogin = dayjs().toDate();
    return this;
  }

  setRecoverPasswordData(token: string) {
    this.recoverPasswordToken = token;
    this.recoverPasswordTokenExpire = dayjs().add(30, 'minute').toDate();
    return this;
  }

  resetPassword(passwordHash: string) {
    this.password = passwordHash;
    this.recoverPasswordToken = null;
    this.recoverPasswordTokenExpire = null;
  }
}
