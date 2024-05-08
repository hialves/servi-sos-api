import { Module } from '@nestjs/common';
import { ServiceProviderController } from '../../presentation/controllers/service-provider.controller';
import { CreateServiceProviderUsecase } from '../../application/usecases/service-provider/create-service-provider.usecase';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ServiceProviderController],
  providers: [CreateServiceProviderUsecase],
})
export class ServiceProviderModule {}
