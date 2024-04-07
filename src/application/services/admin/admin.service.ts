import { HttpStatus } from '@nestjs/common';
import { ExternalID, ID } from '../../../domain/entities';
import { Admin } from '../../../domain/entities/admin';
import { UpdateAdminData } from '../../../domain/valueobjects/update-admin-data';
import { ApplicationError } from '../../errors/application-error';
import { PasswordService } from '../../interfaces/password-service.interface';
import { responseMessages } from '../../messages/response.messages';
import { AdminRepository } from '../../repositories/admin-repository.interface';
import { CreateAdminData } from '../../../domain/valueobjects/create-admin-data';

export class AdminService {
  constructor(
    private repository: AdminRepository,
    private passwordService: PasswordService,
  ) {}

  async create(input: CreateAdminData) {
    if (input.data.password) input.data.password = await this.passwordService.hashPassword(input.data.password);
    return this.repository.create(input);
  }

  async update(externalId: ExternalID, updateData: UpdateAdminData): Promise<Admin | ApplicationError> {
    const existsAdmin = await this.repository.findByExternalId(externalId);
    if (!existsAdmin)
      return new ApplicationError(
        responseMessages.notFound(responseMessages.admin.entity),
        undefined,
        HttpStatus.NOT_FOUND,
      );

    const admin = new Admin({
      ...existsAdmin,
      ...updateData.data,
    });

    return this.repository.update(admin);
  }
}
