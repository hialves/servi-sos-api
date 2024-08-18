import dayjs from 'dayjs';
import { ID } from '.';
import { Replace } from '../../helper/replace';

type History = Array<{ price: number; date: string }>;

export interface OrderInterestedFields {
  createdAt: Date;
  updatedAt: Date;
  givenPrice: number;
  history: History;
  serviceProviderId: ID;
  orderId: ID;
}

export class OrderInterested {
  private props: OrderInterestedFields;

  constructor(input: Replace<OrderInterestedFields, { history?: History; createdAt?: Date; updatedAt?: Date }>) {
    this.props = {
      ...input,
      createdAt: input.createdAt ?? dayjs.tz(undefined, 'utc').toDate(),
      updatedAt: input.updatedAt ?? dayjs.tz(undefined, 'utc').toDate(),
      history: input.history ?? [this.createHistory(input.givenPrice)],
    };
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

  private createHistory(price: number) {
    return { price, date: new Date().toISOString() };
  }
  addHistory(history: History[number]) {
    this.props.history.push(history);
  }
  getHistory(orderByDate: 'desc' | 'asc') {
    if (orderByDate === 'asc') return this.props.history;
    return this.props.history.reduceRight<History>((acc, item) => {
      acc.push(item);
      return acc;
    }, []);
  }
  isNewPrice(price: number) {
    return this.givenPrice !== price;
  }
  changePrice(price: number) {
    if (this.isNewPrice(price)) {
      this.props.givenPrice = price;
      this.addHistory(this.createHistory(price));
    }
  }
}
