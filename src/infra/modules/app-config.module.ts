import { Module, Global } from '@nestjs/common';
import { AppConfig } from '../config/app.config';
import { PaymentModule } from './payment.module';

@Global()
@Module({
  imports: [PaymentModule],
  controllers: [],
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
