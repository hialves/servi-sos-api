import { Injectable } from '@nestjs/common';
import { isPhoneNumber } from 'class-validator';
import { MessageListInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { responseMessages } from '../../../../application/messages/response.messages';
import { SmsService } from '../../../../application/interfaces/sms-service.interface';

@Injectable()
export class TwilioSmsService implements SmsService {
  constructor(private twilioSms: MessageListInstance) {}

  async send(body: string, phone: string) {
    if (!isPhoneNumber(phone)) throw new Error(responseMessages.invalidPhone);

    const result = await this.twilioSms.create({
      body,
      to: phone,
      from: process.env.PHONE_FROM,
      attempt: 2,
    });

    return { success: !result.errorCode };
  }
}
