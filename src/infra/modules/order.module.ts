import { Module } from '@nestjs/common';
import { CreateOrderUsecase } from '../../application/usecases/order/create-order.usecase';
import { OrderController } from '../../presentation/controllers/order.controller';
import { NotificationModule } from '../frameworks/notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [CreateOrderUsecase],
  controllers: [OrderController],
})
export class OrderModule {}
