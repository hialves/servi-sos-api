import { Money } from '../valueobjects/money.value-object';

export class OrderPrice {
  private readonly price: Money;

  constructor(config: { priceEachOrder: number }) {
    this.price = new Money(config.priceEachOrder);
  }

  getPrice() {
    return this.price.value;
  }
}
