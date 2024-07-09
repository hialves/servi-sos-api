import { Module, Global } from '@nestjs/common';
import { AppConfig } from '../config/app.config';
import { PaymentModule } from './payment.module';

@Global()
@Module({
  imports: [PaymentModule],
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
