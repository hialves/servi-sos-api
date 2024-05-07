import { ApplicationError } from '../errors/application-error';

export abstract class NotificationService {
  abstract sendNotificationToUser(notify: {
    userIdentifier: string;
    title: string;
    message: string;
  }): Promise<ApplicationError | void>;
}
