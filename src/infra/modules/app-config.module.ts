import { Module, Global } from '@nestjs/common';
import { AppConfig } from '../config/app.config';
import { PaymentModule } from './payment.module';
import { AppConfigController } from '../../presentation/controllers/app-config.controller';

@Global()
@Module({
  imports: [PaymentModule],
  controllers: [AppConfigController],
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
