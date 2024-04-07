import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ExternalID, ID } from '../../../../domain/entities';
import { Customer as PrismaCustomer } from '@prisma/client';
import { Customer } from '../../../../domain/entities/customer';
import { CustomerRepository } from '../../../../application/repositories/customer-repository.interface';
import { CreateCustomerData } from '../../../../domain/valueobjects/create-customer-data';

function toDomain(result: PrismaCustomer | null): Customer | null {
  if (result) return new Customer(result);
  return null;
}

@Injectable()
export class CustomerPrismaRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.customer;
  }

  async create(input: CreateCustomerData) {
    const { password, role, ...customerData } = input.data;
    const result = await this.prisma.$transaction(
      async (tx) => {
        return tx.customer.create({
          data: { ...customerData, user: { create: { email: customerData.email, password, role } } },
        });
      },
      { isolationLevel: 'ReadUncommitted' },
    );

    return new Customer(result);
  }

  async findById(id: ID): Promise<Customer | null> {
    const result = await this.repository.findUnique({
      where: { id },
    });
    return toDomain(result);
  }

  async findByExternalId(externalId: ExternalID): Promise<Customer | null> {
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

  async update(input: Customer): Promise<Customer> {
    return new Customer(await this.repository.update({ where: { id: input.id }, data: input }));
  }

  async getByUserId(userId: ID): Promise<Customer | null> {
    const result = await this.repository.findUnique({
      where: { userId },
    });
    return toDomain(result);
  }
}
