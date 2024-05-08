import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ServiceProviderConfigRepository } from '../../../../application/repositories/service-provider-config.interface';
import { Location } from '../../../../domain/valueobjects/location.value-object';
import dayjs from 'dayjs';
import { ID } from '../../../../domain/entities';
import { Transaction } from '../prisma.interface';

@Injectable()
export class ServiceProviderConfigPrismaRepository implements ServiceProviderConfigRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.serviceProviderConfig;
  }

  async createEmpty(serviceProviderId: ID, tx: Transaction = this.prisma) {
    await tx.$executeRaw`INSERT INTO "ServiceProviderConfig" ("updatedAt","serviceProviderId") VALUES (${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}::timestamp,${serviceProviderId})`;
  }

  async setLocation(serviceProviderId: number, location: Location): Promise<void> {
    const { lat, long } = location;
    await this.prisma.$queryRaw`
      INSERT INTO "ServiceProviderConfig" ("updatedAt",lat,long,coordinates,"serviceProviderId")
      VALUES (${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}::timestamp,${lat},${long},
              ST_SetSRID(ST_MakePoint(${long}::double precision,${lat}::double precision), 4326),
              ${serviceProviderId})
      ON CONFLICT ("serviceProviderId")
      DO UPDATE SET 
        "updatedAt" = ${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}::timestamp,
        lat = ${lat},
        long = ${long},
        coordinates = ST_SetSRID(ST_MakePoint(${long}::double precision,${lat}::double precision), 4326)
    `;
  }

  async setFirebaseIdentifier(serviceProviderId: number, firebaseUserIdentifier: string | null): Promise<void> {
    await this.prisma.serviceProviderConfig.update({ where: { serviceProviderId }, data: { firebaseUserIdentifier } });
  }
}
