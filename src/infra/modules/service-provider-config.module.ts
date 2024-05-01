import { Module } from '@nestjs/common';
import { SetServiceProviderConfigService } from '../../application/services/service-provider-config/set-service-provider-config.service';
import { ServiceProviderConfigController } from '../../presentation/controllers/service-provider-config.controller';

@Module({
  providers: [SetServiceProviderConfigService],
  controllers: [ServiceProviderConfigController],
})
export class ServiceProviderConfigModule {}
