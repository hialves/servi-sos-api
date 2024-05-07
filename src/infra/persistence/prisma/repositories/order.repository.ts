import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../../../application/repositories/order-repository.interface';
import { CreateOrderDto } from '../../../../application/usecases/order/create-order.dto';
import { Order } from '../../../../domain/entities/order';
import { Order as PrismaOrder } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ExternalID, ID } from '../../../../domain/entities';
import dayjs from 'dayjs';

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
    const result: [{ id: ID }] = await this.prisma.$queryRaw`
      INSERT INTO "Order" ("updatedAt",lat,long,coordinates,price,description,"categoryId","customerId","externalId")
      VALUES (${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}::timestamp,${input.lat},
              ${input.long},ST_SetSRID(ST_MakePoint(${input.long}::double precision,${input.lat}::double precision), 4326),
              ${input.price},${input.description || null},${input.categoryId || null},${input.customerId},gen_random_uuid())
      RETURNING id
    `;

    return this.findById(result[0].id) as Promise<Order>;
  }

  async delete(externalId: string): Promise<void> {
    await this.repository.delete({ where: { externalId } });
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

  async update(input: Order): Promise<Order> {
    const result = await this.repository.update({
      where: { id: input.id },
      data: input,
      include: { category: true, customer: true, serviceProvider: true },
    });
    return toDomain(result);
  }
}
