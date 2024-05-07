import { Module, Global } from '@nestjs/common';
import { ServiceProviderNotifier } from '../../domain/services/service-provider-notifier';
import { NotificationModule } from '../frameworks/notification/notification.module';

const providers = [ServiceProviderNotifier];

@Global()
@Module({
  imports: [NotificationModule],
  providers,
  exports: providers,
})
export class DomainModule {}
