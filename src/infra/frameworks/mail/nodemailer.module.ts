import { Module, Global } from '@nestjs/common';
import { NodeMailerService } from './nodemailer.service';
import { MailService } from '../../../application/interfaces/mail-service.interface';

@Global()
@Module({
  providers: [{ provide: MailService, useClass: NodeMailerService }],
  exports: [MailService],
})
export class NodeMailerModule {}
