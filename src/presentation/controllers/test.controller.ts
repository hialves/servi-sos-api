import { Body, Controller, Post } from '@nestjs/common';
import { IsPublic } from '../decorators/public.decorator';
import { NotificationService } from '../../application/interfaces/notification-service.interface';
import admin from 'firebase-admin';

@Controller('playground')
export class TestController {
  constructor(private notificationService: NotificationService) {}

  @IsPublic()
  @Post('notify')
  notify(@Body() body: any) {
    return this.notificationService.sendNotificationToUser(body);
  }

  @IsPublic()
  @Post('register')
  async register(@Body() body: any) {
    console.log({ body });
    // console.log(await admin.auth().getUserByEmail(body.email));
    console.log(await admin.auth().verifyIdToken(body.idToken));
    // return admin.auth().createUser(body);
    // return this.notificationService.sendNotificationToUser(body);
  }
}
