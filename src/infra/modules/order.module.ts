import { Module } from '@nestjs/common';
import { CreateOrderUsecase } from '../../application/usecases/order/create-order.usecase';
import { OrderController } from '../../presentation/controllers/order.controller';
import { NotificationModule } from '../frameworks/notification/notification.module';
import { OrderService } from '../../application/services/order.service';

@Module({
  imports: [NotificationModule],
  controllers: [OrderController],
  providers: [CreateOrderUsecase, OrderService],
})
export class OrderModule {}
