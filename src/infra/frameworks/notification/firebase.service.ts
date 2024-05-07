import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { NotificationService } from '../../../application/interfaces/notification-service.interface';
import { OnModuleInit } from '@nestjs/common';

export class FirebaseService implements NotificationService, OnModuleInit {
  onModuleInit() {
    initializeApp();
  }
  async sendNotificationToUser(notify: { userIdentifier: string; title: string; message: string }): Promise<void> {
    await admin
      .messaging()
      .send({ token: notify.userIdentifier, notification: { title: notify.title, body: notify.message } });
  }
}
