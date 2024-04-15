import { Module, Global } from '@nestjs/common';
import { AppConfig } from '../config/app.config';

@Global()
@Module({
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
