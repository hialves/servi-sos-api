import { Injectable } from '@nestjs/common';
import { ServiceProviderCategoryRepository } from '../../application/repositories/service-provider-category.interface';
import { Location } from '../valueobjects/location.value-object';
import { ID } from '../entities';
import { NotificationService } from '../../application/interfaces/notification-service.interface';
import { Order } from '../entities/order';
import { CategoryRepository } from '../../application/repositories/category-repository.interface';

@Injectable()
export class ServiceProviderNotifier {
  constructor(
    private repository: ServiceProviderCategoryRepository,
    private categoryRepository: CategoryRepository,
    private notificationService: NotificationService,
  ) {}

  async notify(order: Order, referencePoint: Location, meters: number, categoryId: ID): Promise<void> {
    const spc = await this.repository.getServiceProvidersInCategory(referencePoint, meters, categoryId);
    const category = await this.categoryRepository.findById(categoryId);

    spc.forEach((item) => {
      if (item.firebaseUserIdentifier)
        // Notificar com o firebase
        this.notificationService.sendNotificationToUser({
          title: 'Novo serviço postado',
          message: `Categoria: ${category!.name}. ${order.description ? order.description : ''}`.trimEnd(),
          userIdentifier: item.firebaseUserIdentifier,
        });
    });
  }
}
