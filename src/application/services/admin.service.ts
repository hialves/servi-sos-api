import { HttpStatus, Injectable } from '@nestjs/common';
import { ExternalID } from '../../domain/entities';
import { Admin } from '../../domain/entities/admin';
import { UpdateAdminData } from '../../domain/valueobjects/update-admin-data';
import { ApplicationError } from '../errors/application-error';
import { PasswordService } from '../interfaces/password-service.interface';
import { responseMessages } from '../messages/response.messages';
import { AdminRepository } from '../repositories/admin-repository.interface';
import { CreateAdminData } from '../../domain/valueobjects/create-admin-data';
import { Request } from 'express';
import { UserRepository } from '../repositories/user-repository.interface';
import { AuthService } from '../../infra/auth/auth.service';
import { default as firebaseAdmin } from 'firebase-admin';

@Injectable()
export class AdminService {
  constructor(
    private repository: AdminRepository,
    private userRepository: UserRepository,
    private authService: AuthService,
    private passwordService: PasswordService,
  ) {}

  async create(input: CreateAdminData) {
    if (input.data.password) input.data.password = await this.passwordService.hashPassword(input.data.password);
    return this.repository.create(input);
  }

  async update(externalId: ExternalID, updateData: UpdateAdminData): Promise<Admin | ApplicationError> {
    const admin = await this.repository.findByExternalId(externalId);
    if (!admin) return new ApplicationError(responseMessages.notFound(responseMessages.admin), HttpStatus.NOT_FOUND);

    if (updateData.data.name !== undefined) admin.name = updateData.data.name;
    if (updateData.data.email !== undefined) admin.email = updateData.data.email;
    if (updateData.data.assetId !== undefined) admin.assetId = updateData.data.assetId;
    if (updateData.data.userId !== undefined) admin.userId = updateData.data.userId;

    return this.repository.update(admin);
  }

  async handleGoogleAuth(input: CreateAdminData, request: Request) {
    const admin = await this.repository.findByGoogleId(input.data.googleId!);
    if (admin && admin.userId) {
      const user = await this.userRepository.findById(admin?.userId);
      if (user) return this.authService.authenticateUser(user, request);
    }

    if (!admin) {
      await firebaseAdmin
        .auth()
        .createUser({
          email: input.data.email,
          disabled: false,
          displayName: input.data.name,
          uid: input.data.googleId,
          photoURL: input.data.photoURL,
        })
        .catch((e) => e);

      const existsAdmin = await this.repository.findByEmail(input.data.email);
      if (!existsAdmin) {
        const newAdmin = await this.create(input);
        await this.update(newAdmin.externalId, new UpdateAdminData(newAdmin));
        const user = await this.userRepository.findById(newAdmin.userId!);
        if (user) {
          return this.authService.authenticateUser(user, request);
        }
      } else {
        const user = await this.userRepository.findById(existsAdmin.userId!);
        if (user) return this.authService.authenticateUser(user, request);
      }
    }
  }
}
