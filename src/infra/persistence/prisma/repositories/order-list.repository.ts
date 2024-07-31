import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ExternalID, ID } from '../../../../domain/entities';
import { Location } from '../../../../domain/valueobjects/location.value-object';
import {
  OrderFullPayload,
  OrderListRepository,
} from '../../../../application/repositories/order-list-repository.interface';

@Injectable()
export class OrderListPrismaRepository implements OrderListRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.order;
  }

  async customerOrders(customerExternalId: string) {
    const result = await this.repository.findMany({
      where: { customer: { externalId: customerExternalId } },
      orderBy: { createdAt: 'desc' },
      include: { category: true, customer: true, serviceProvider: true },
    });

    return result;
  }

  async serviceProviderOrders(serviceProviderExternalId: ExternalID) {
    const result = await this.repository.findMany({
      where: { serviceProvider: { externalId: serviceProviderExternalId } },
      include: { category: true, customer: true, serviceProvider: true },
    });

    return result;
  }

  async activeOrders(referencePoint: Location, meters: number, filters: { categoryId?: ID }) {
    const parsed = `'POINT(${referencePoint.long} ${referencePoint.lat})'`;
    const categoryQuery = filters.categoryId ? 'AND o."categoryId" = $1' : '';
    const result = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
        o.id,o."createdAt",o."updatedAt",o.lat,o.long,o.done,o.price,o."agreedPrice",o.description,o."externalId",o."categoryId",o."customerId",o."serviceProviderId",
        row_to_json(category) "category",
        row_to_json(c) "customer",
        row_to_json(a) "serviceProvider"
      FROM "Order" o
      LEFT JOIN "Customer" c ON c.id = o."customerId"
      LEFT JOIN "Admin" a ON a.id = o."serviceProviderId"
      LEFT JOIN "Category" category ON category.id = o."categoryId" ${categoryQuery}
      WHERE ST_DWithin(o.coordinates, ST_GeomFromText(${parsed},4326)::geography, ${meters})
        AND o.done = false
    `,
      ...(filters.categoryId ? [filters.categoryId] : []),
    );
    console.log(result);
    return result as OrderFullPayload[];
  }
}
