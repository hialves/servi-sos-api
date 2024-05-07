import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ServiceProviderCategoryRepository } from '../../../../application/repositories/service-provider-category.interface';
import { Location } from '../../../../domain/valueobjects/location.value-object';
import { ID } from '../../../../domain/entities';

@Injectable()
export class ServiceProviderCategoryPrismaRepository implements ServiceProviderCategoryRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.serviceProviderCategory;
  }

  async add(serviceProviderId: number, categoryId: number): Promise<void> {
    await this.repository.create({ data: { serviceProviderId, categoryId } });
  }

  async bulkAdd(serviceProviderId: number, categoryIds: number[]): Promise<void> {
    await this.repository.createMany({
      data: categoryIds.map((item) => ({ serviceProviderId, categoryId: item })),
      skipDuplicates: true,
    });
  }

  async exists(serviceProviderId: number, categoryId: number): Promise<boolean> {
    const result = await this.repository.findUnique({
      where: { serviceProviderId_categoryId: { serviceProviderId, categoryId } },
    });
    return !!result;
  }

  async remove(serviceProviderId: number, categoryId: number): Promise<boolean> {
    try {
      await this.repository.delete({
        where: { serviceProviderId_categoryId: { serviceProviderId, categoryId } },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async getServiceProvidersInCategory(referencePoint: Location, meters: number, categoryId: ID) {
    const parsed = `'POINT(${referencePoint.long} ${referencePoint.lat})'`;
    return this.prisma.$queryRawUnsafe<{ serviceProviderId: ID; firebaseUserIdentifier: string | null }[]>(
      `
      SELECT 
        spcategory."serviceProviderId", spconfig."firebaseUserIdentifier"
      FROM "ServiceProviderCategory" spcategory
      INNER JOIN "ServiceProviderConfig" spconfig ON spconfig."serviceProviderId" = spcategory."serviceProviderId"
      WHERE
        ST_DWithin(spconfig.coordinates, ST_GeomFromText(${parsed},4326)::geography, ${meters})
        AND spcategory."categoryId" = ${categoryId}
    `,
    );
  }
}
