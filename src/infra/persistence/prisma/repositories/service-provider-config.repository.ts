import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ServiceProviderConfigRepository } from '../../../../application/repositories/service-provider-config.interface';
import { Location } from '../../../../domain/valueobjects/location.value-object';
import dayjs from 'dayjs';

@Injectable()
export class ServiceProviderConfigPrismaRepository implements ServiceProviderConfigRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.serviceProviderConfig;
  }

  async set(serviceProviderId: number, input: { location: Location }): Promise<void> {
    const { lat, long } = input.location;
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
}
