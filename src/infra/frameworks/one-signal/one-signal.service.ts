import { HttpException, Injectable } from '@nestjs/common';
import { NotificationMessage } from './interfaces/onesignal.interface';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class OnesignalService {
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

  async sendNotificationToUser(
    externalUserId: string,
    contents: NotificationMessage,
    headings: NotificationMessage,
  ): Promise<void> {
    try {
      await this.oneSignal.post('/notifications', {
        app_id: process.env.ONESIGNAL_APP_KEY,
        contents,
        headings,
        include_external_user_ids: [externalUserId],
      });
    } catch (error) {
      throw new HttpException('notification Error', 400);
    }
  }
}
