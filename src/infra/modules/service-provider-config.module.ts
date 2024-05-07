import { Module } from '@nestjs/common';
import { SetLocationServiceProviderUsecase } from '../../application/usecases/service-provider-config/set-location-service-provider.usecase';
import { ServiceProviderConfigController } from '../../presentation/controllers/service-provider-config.controller';
import { SetFirebaseIdentifierServiceProviderUsecase } from '../../application/usecases/service-provider-config/set-firebase-identifier-service-provider.usecase';

@Module({
  providers: [SetLocationServiceProviderUsecase, SetFirebaseIdentifierServiceProviderUsecase],
  controllers: [ServiceProviderConfigController],
})
export class ServiceProviderConfigModule {}
