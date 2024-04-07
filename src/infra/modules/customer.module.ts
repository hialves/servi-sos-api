import { Module } from '@nestjs/common';
import { CustomerService } from '../../application/services/customer/customer.service';
import { AuthModule } from './auth.module';
import { CustomerController } from '../../presentation/controllers/customer.controller';
import { PrismaModule } from '../persistence/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
