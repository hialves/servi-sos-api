import { Module } from '@nestjs/common';
import { CustomerService } from '../../application/services/customer.service';
import { AuthModule } from './auth.module';
import { CustomerController } from '../../presentation/controllers/customer.controller';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { PaymentModule } from './payment.module';
import { GetCustomerPaymentMethodsUsecase } from '../../application/usecases/customer/get-customer-payment-methods.usecase';
import { SetFirebaseIdentifierCustomerUsecase } from '../../application/usecases/customer/set-firebase-identifier-customer.usecase';

@Module({
  imports: [PrismaModule, AuthModule, PaymentModule],
  providers: [CustomerService, GetCustomerPaymentMethodsUsecase, SetFirebaseIdentifierCustomerUsecase],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
