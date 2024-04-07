import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ExternalID, ID } from '../../../../domain/entities';
import { Admin } from '../../../../domain/entities/admin';
import { Admin as PrismaAdmin } from '@prisma/client';
import { AdminRepository } from '../../../../application/repositories/admin-repository.interface';
import { CreateAdminData } from '../../../../domain/valueobjects/create-admin-data';

function toDomain(result: PrismaAdmin | null): Admin | null {
  if (result) return new Admin(result);
  return null;
}

@Injectable()
export class AdminPrismaRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.admin;
  }

  async create(input: CreateAdminData) {
    const { password, role, ...adminData } = input.data;
    const result = await this.prisma.$transaction(
      async (tx) => {
        return tx.admin.create({
          data: { ...adminData, user: { create: { email: adminData.email, password, role } } },
        });
      },
      { isolationLevel: 'ReadUncommitted' },
    );

    return new Admin(result);
  }

  async findById(id: ID): Promise<Admin | null> {
    const result = await this.repository.findUnique({
      where: { id },
    });
    return toDomain(result);
  }

  async findByExternalId(externalId: ExternalID): Promise<Admin | null> {
    const result = await this.repository.findUnique({
      where: { externalId },
    });
    return toDomain(result);
  }

  async findByEmail(email: string) {
    const result = await this.repository.findFirst({
      where: { email },
    });
    return toDomain(result);
  }

  async update(input: Admin): Promise<Admin> {
    const admin = await this.repository.update({ where: { id: input.id }, data: input });
    return new Admin(admin);
  }

  async getByUserId(userId: ID): Promise<Admin | null> {
    const result = await this.repository.findUnique({
      where: { userId },
    });
    return toDomain(result);
  }
}
