import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderPrice } from '../../domain/entities/order-price';

@Injectable()
export class AppConfig {
  private readonly orderPrice: OrderPrice;

  constructor(private configService: ConfigService) {
    const priceEachOrder = +configService.getOrThrow<string>('APP_PRICE_EACH_ORDER_TO_CUSTOMER');
    this.orderPrice = new OrderPrice({ priceEachOrder });
  }

  getOrderPrice() {
    return this.orderPrice.getPrice();
  }
}
