import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { NotificationService } from '../../../application/interfaces/notification-service.interface';
import { ApplicationError } from '../../../application/errors/application-error';

@Injectable()
export class OnesignalService implements NotificationService {
  private oneSignal: AxiosInstance;

  constructor() {
    this.oneSignal = axios.create({
      baseURL: process.env.ONESIGNAL_URL,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${process.env.ONESIGNAL_USER_KEY}`,
      },
    });
  }

  async sendNotificationToUser(notify: {
    userIdentifier: string;
    title: string;
    message: string;
  }): Promise<ApplicationError | void> {
    try {
      await this.oneSignal.post('/notifications', {
        app_id: process.env.ONESIGNAL_APP_KEY,
        headings: { pt: notify.title },
        contents: { pt: notify.message },
        include_external_user_ids: [notify.userIdentifier],
      });
    } catch (error) {
      return new ApplicationError(error.message, 400);
    }
  }
}
