import { PaymentStatus } from '@prisma/client';
import { ExternalID, ID } from '.';
import { Location } from '../valueobjects/location.value-object';
import dayjs from 'dayjs';

export interface OrderFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  categoryId: ID | null;
  customerId: ID | null;
  serviceProviderId: number | null;
  location: Location;
  done: boolean;
  published: boolean;
  publishedAt: Date | null;
  price: number;
  agreedPrice: number | null;
  externalId: ExternalID;
  description: string | null;
  paymentGatewayOrderId: string | null;
  paymentStatus: PaymentStatus;
}

export class Order {
  private props: OrderFields;

  constructor(input: OrderFields) {
    this.props = input;
  }

  get id() {
    return this.props.id;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get categoryId() {
    return this.props.categoryId;
  }
  get customerId() {
    return this.props.customerId;
  }
  get serviceProviderId() {
    return this.props.serviceProviderId;
  }
  get location() {
    return this.props.location;
  }
  set location(value: Location) {
    this.props.location = value;
  }
  get done() {
    return this.props.done;
  }
  get price() {
    return this.props.price;
  }
  get agreedPrice() {
    return this.props.agreedPrice;
  }
  get externalId() {
    return this.props.externalId;
  }
  get description() {
    return this.props.description;
  }
  get paymentGatewayOrderId() {
    return this.props.paymentGatewayOrderId;
  }
  get paymentStatus() {
    return this.props.paymentStatus;
  }
  get published() {
    return this.props.published;
  }
  get publishedAt() {
    return this.props.publishedAt;
  }

  changeCategory(categoryId: ID) {
    this.props.categoryId = categoryId;
  }

  setAgreedPrice(agreedPrice: number) {
    this.props.agreedPrice = agreedPrice;
  }

  setCustomerLocation(coords: { lat: number; long: number }) {
    this.props.location = new Location(coords);
  }

  assignServiceProvider(serviceProviderId: ID) {
    this.props.serviceProviderId = serviceProviderId;
  }

  unassignServiceProvider() {
    this.props.serviceProviderId = null;
    this.props.agreedPrice = null;
  }

  unwrap() {
    const { location, ...rest } = this.props;
    return { ...rest, ...location };
  }

  publishOnPaymentSuccess(paymentGatewayOrderId: string) {
    this.updatePaymentStatus(PaymentStatus.success, paymentGatewayOrderId);
    this.props.done = false;
    this.props.published = true;
    this.props.publishedAt = dayjs.tz().toDate();
  }

  updatePaymentStatus(paymentStatus: PaymentStatus, paymentGatewayOrderId: string) {
    this.props.paymentStatus = paymentStatus;
    this.props.paymentGatewayOrderId = paymentGatewayOrderId;
  }
}
