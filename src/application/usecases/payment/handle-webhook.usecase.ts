import { Injectable } from '@nestjs/common';
import { StripeService } from '../../../infra/frameworks/payment/stripe.service';
import { OrderRepository } from '../../repositories/order-repository.interface';
import { NotificationService } from '../../interfaces/notification-service.interface';
import { OrderStatus } from '@prisma/client';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { Order } from '../../../domain/entities/order';

@Injectable()
export class HandleWebhookUsecase {
  constructor(
    private stripeService: StripeService,
    private orderRepository: OrderRepository,
    private notificationService: NotificationService,
    private customerRepository: CustomerRepository,
  ) {}

  async execute(body: any, signature: string) {
    const event = await this.stripeService.getWebhookData(
      body,
      signature,
      'whsec_17c6c5ea8f767035df4058b795a7c1f64a610f277bb6699857bbd6d9e34dabbc',
    );

    if (!event) return;

    switch (event.type) {
      case 'payment_intent.succeeded':
        this.orderRepository.findById(+event.data.object.metadata.orderId).then((order) => {
          if (order) {
            order.status = OrderStatus.success;
            order.paymentGatewayOrderId = event.data.object.id;
            this.orderRepository.update(order).catch((e) => console.log(e));
            this.notify(order, {
              message: `Informamos os profissionais do seu pedido`,
              title: `Pedido #${+event.data.object.metadata.orderId}`,
            });
          }
        });
        break;

      case 'payment_intent.payment_failed':
        this.orderRepository.findById(+event.data.object.metadata.orderId).then((order) => {
          if (order) {
            order.status = OrderStatus.payment_failed;
            order.paymentGatewayOrderId = event.data.object.id;
            this.orderRepository.update(order).catch((e) => e);
            this.notify(order, {
              message: `Houve um problema com o pagamento do pedido #${+event.data.object.metadata.orderId}`,
              title: 'Falha no pagamento',
            });
          }
        });
        break;

      case 'payment_intent.processing':
        this.orderRepository.findById(+event.data.object.metadata.orderId).then((order) => {
          if (order) {
            order.status = OrderStatus.processing;
            order.paymentGatewayOrderId = event.data.object.id;
            this.orderRepository.update(order).catch((e) => e);
          }
        });
        break;
    }
  }

  private notify(
    order: Order,
    notifyOptions: {
      title: string;
      message: string;
    },
  ) {
    if (!order.customerId) return;

    this.customerRepository.findById(order.customerId).then((customer) => {
      if (customer?.firebaseUserIdentifier)
        this.notificationService.sendNotificationToUser({
          userIdentifier: customer.firebaseUserIdentifier,
          ...notifyOptions,
        });
    });
  }
}
