import { Module } from '@nestjs/common';
import { CreateOrderService } from '../../application/services/order/create-order.service';
import { OrderController } from '../../presentation/controllers/order.controller';

@Module({
  providers: [CreateOrderService],
  controllers: [OrderController],
  exports: [CreateOrderService],
})
export class OrderModule {}
