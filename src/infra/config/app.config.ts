import { Injectable } from '@nestjs/common';
import { OrderPrice } from '../../domain/entities/order-price';
import { StripeService } from '../frameworks/payment/stripe.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  private orderPrice: OrderPrice;
  static readonly defaultOrderPrice = 800;

  constructor(
    private configService: ConfigService,
    private stripeService: StripeService,
  ) {
    this.init();
  }

  async init() {
    const product = this.configService.get('NORMAL_SOLICITATION_PRODUCT_ID');
    const price = await this.stripeService.getProductPrice(product);
    this.setOrderPrice(price.unit_amount || AppConfig.defaultOrderPrice);
  }

  async setOrderPrice(value: number) {
    this.orderPrice = new OrderPrice({ priceEachOrder: value });
  }

  getOrderPrice() {
    return this.orderPrice.getPrice();
  }
}
