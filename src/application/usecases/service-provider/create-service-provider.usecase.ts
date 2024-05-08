import { Injectable } from '@nestjs/common';
import { CreateServiceProviderDto } from '../../../presentation/dto/service-provider/create-service-provider.dto';
import { PasswordService } from '../../interfaces/password-service.interface';
import { AdminRepository } from '../../repositories/admin-repository.interface';
import { CreateAdminData } from '../../../domain/valueobjects/create-admin-data';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../infra/persistence/prisma/prisma.service';
import { ServiceProviderConfigRepository } from '../../repositories/service-provider-config.interface';
import { Admin } from '../../../domain/entities/admin';

@Injectable()
export class CreateServiceProviderUsecase {
  constructor(
    private repository: AdminRepository,
    private serviceProviderConfigRepository: ServiceProviderConfigRepository,
    private passwordService: PasswordService,
    private prismaService: PrismaService,
  ) {}

  async execute(dto: CreateServiceProviderDto): Promise<Admin> {
    const input = new CreateAdminData({ ...dto, role: Role.admin });
    if (input.data.password) input.data.password = await this.passwordService.hashPassword(input.data.password);
    return this.prismaService.$transaction(
      async (tx) => {
        const createdAdmin = await this.repository.create(input, tx);
        await this.serviceProviderConfigRepository.createEmpty(createdAdmin.id, tx);
        return createdAdmin;
      },
      { isolationLevel: 'ReadUncommitted' },
    ) as Promise<Admin>;
  }
}
