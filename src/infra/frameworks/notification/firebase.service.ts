import admin from 'firebase-admin';
import { initializeApp, ServiceAccount } from 'firebase-admin/app';
import { NotificationService } from '../../../application/interfaces/notification-service.interface';
import { OnModuleInit } from '@nestjs/common';
import serviceAccount from '../../../../servi-sos-firebase-adminsdk-h9jqg-b640d436f3.json';

export class FirebaseService implements NotificationService, OnModuleInit {
  onModuleInit() {
    initializeApp({ credential: admin.credential.cert(serviceAccount as ServiceAccount) });
  }

  async sendNotificationToUser(notify: { userIdentifier: string; title: string; message: string }): Promise<void> {
    await admin
      .messaging()
      .send({ token: notify.userIdentifier, notification: { title: notify.title, body: notify.message } });
  }
}
