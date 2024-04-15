import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../../../application/repositories/order-repository.interface';
import { CreateOrderDto } from '../../../../application/services/order/create-order.dto';
import { Order } from '../../../../domain/entities/order';
import { Order as PrismaOrder } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ExternalID, ID } from '../../../../domain/entities';

function toDomain(result: PrismaOrder): Order {
  return new Order(result);
}

function maybeToDomain(result: PrismaOrder | null): Order | null {
  if (result) return toDomain(result);
  return null;
}

@Injectable()
export class OrderPrismaRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.order;
  }

  async createOrder(input: CreateOrderDto): Promise<Order> {
    const result = await this.repository.create({
      data: input,
    });

    return toDomain(result);
  }

  async delete(externalId: string): Promise<void> {
    await this.repository.delete({ where: { externalId } });
  }

  async customerOrders(customerExternalId: string): Promise<Order[]> {
    const result = await this.repository.findMany({
      where: { customer: { externalId: customerExternalId } },
    });

    return result.map(toDomain);
  }

  async findById(id: ID): Promise<Order | null> {
    const result = await this.repository.findUnique({
      where: { id },
    });
    return maybeToDomain(result);
  }

  async findByExternalId(externalId: ExternalID): Promise<Order | null> {
    const result = await this.repository.findUnique({
      where: { externalId },
    });
    return maybeToDomain(result);
  }

  async serviceProviderOrders(serviceProviderExternalId: ExternalID): Promise<Order[]> {
    const result = await this.repository.findMany({
      where: { serviceProvider: { externalId: serviceProviderExternalId } },
    });

    return result.map(toDomain);
  }

  async update(input: Order): Promise<Order> {
    const result = await this.repository.update({
      where: { id: input.id },
      data: input,
      include: { category: true, customer: true, serviceProvider: true },
    });
    return toDomain(result);
  }
}
