import { Module } from '@nestjs/common';
import { SetServiceProviderConfigUsecase } from '../../application/usecases/service-provider-config/set-service-provider-config.usecase';
import { ServiceProviderConfigController } from '../../presentation/controllers/service-provider-config.controller';

@Module({
  providers: [SetServiceProviderConfigUsecase],
  controllers: [ServiceProviderConfigController],
})
export class ServiceProviderConfigModule {}
