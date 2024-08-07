import { ID } from '.';

type History = Array<{ price: number; date: string }>;

export interface OrderInterestedFields {
  createdAt: Date;
  updatedAt: Date;
  givenPrice: number;
  history: History;
  serviceProviderId: ID | null;
  orderId: ID | null;
}

export class OrderInterested {
  private props: OrderInterestedFields;

  constructor(input: OrderInterestedFields) {
    this.props = input;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get givenPrice() {
    return this.props.givenPrice;
  }
  get history() {
    return this.props.history;
  }
  get orderId() {
    return this.props.orderId;
  }
  get serviceProviderId() {
    return this.props.serviceProviderId;
  }
  addHistory(history: History[number]) {
    this.props.history = this.props.history.concat(history);
  }
  getHistory(orderByDate: 'desc' | 'asc') {
    if (orderByDate === 'asc') return this.props.history;
    return this.props.history.reduceRight<History>((acc, item) => {
      acc.push(item);
      return acc;
    }, []);
  }
  changePrice(price: number) {
    const history: History[number] = { price: this.givenPrice, date: new Date().toISOString() };
    this.props.givenPrice = price;
    this.addHistory(history);
  }
}
