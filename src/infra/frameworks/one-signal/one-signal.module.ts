import { Module } from '@nestjs/common';
import { OnesignalService } from './one-signal.service';

@Module({
  providers: [OnesignalService],
  exports: [OnesignalService],
})
export class OnesignalModule {}
