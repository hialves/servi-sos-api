import { Module } from '@nestjs/common';
import { TwilioSmsService } from './sms/twilio-sms.service';
import customer from 'twilio';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: TwilioSmsService,
      useFactory(configService: ConfigService) {
        const client = customer(configService.get('TWILIO_ACCOUNT_SID'), configService.get('TWILIO_AUTH_TOKEN'), {
          lazyLoading: true,
        });
        return new TwilioSmsService(client.messages);
      },
      inject: [ConfigService],
    },
  ],
  exports: [TwilioSmsService],
})
export class TwilioModule {}
