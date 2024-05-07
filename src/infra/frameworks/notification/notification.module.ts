import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { NotificationService } from '../../../application/interfaces/notification-service.interface';

@Module({
  providers: [{ provide: NotificationService, useClass: FirebaseService }],
  exports: [NotificationService],
})
export class NotificationModule {}
