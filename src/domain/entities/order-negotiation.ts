import { Order } from './order';
import { AcceptanceStatus, OrderInterested } from './order-interested';

export class OrderNegotiation {
  constructor(
    public readonly order: Order,
    public readonly orderInterested: OrderInterested,
  ) {}

  answerQuote(status: AcceptanceStatus): void {
    if (status === AcceptanceStatus.REFUSED) {
      const matchesServiceProvider = this.matchesServiceProvider();
      if (this.order.isFinished() && matchesServiceProvider) return;
      if (!matchesServiceProvider) return this.orderInterested.handleAcceptance(status);
      if (matchesServiceProvider) {
        this.orderInterested.handleAcceptance(status);
        this.order.unassignServiceProvider();
        return;
      }
    }
    if (status === AcceptanceStatus.PENDING) {
      return this.orderInterested.handleAcceptance(status);
    }

    if (status === AcceptanceStatus.ACCEPTED) {
      const matchesServiceProvider = this.matchesServiceProvider();
      if (!matchesServiceProvider) {
        this.order.unassignServiceProvider();
        this.orderInterested.handleAcceptance(status);
        this.order.acceptServiceProviderQuote({
          givenPrice: this.orderInterested.givenPrice,
          serviceProviderId: this.orderInterested.serviceProviderId,
        });
        return;
      }

      if (matchesServiceProvider && this.priceChanged()) {
        this.orderInterested.handleAcceptance(status);
        this.order.acceptServiceProviderQuote({
          givenPrice: this.orderInterested.givenPrice,
          serviceProviderId: this.orderInterested.serviceProviderId,
        });
        return;
      }
    }
  }

  matchesServiceProvider() {
    return this.order.serviceProviderId === this.orderInterested.serviceProviderId;
  }

  priceChanged() {
    return this.order.agreedPrice !== this.orderInterested.givenPrice;
  }
}
