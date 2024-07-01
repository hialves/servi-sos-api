import { HttpStatus, Injectable } from '@nestjs/common';
import { ExternalID } from '../../domain/entities';
import { CustomerRepository } from '../repositories/customer-repository.interface';
import { ApplicationError } from '../errors/application-error';
import { responseMessages } from '../messages/response.messages';
import { Customer, CustomerFields } from '../../domain/entities/customer';
import { PasswordService } from '../interfaces/password-service.interface';
import { UpdateCustomerData } from '../../domain/valueobjects/update-customer-data';
import { CreateCustomerData } from '../../domain/valueobjects/create-customer-data';
import { AuthService } from '../../infra/auth/auth.service';
import { Request } from 'express';
import { UserRepository } from '../repositories/user-repository.interface';
import admin from 'firebase-admin';
import { PaymentService } from '../interfaces/payment-service.interface';

@Injectable()
export class CustomerService {
  constructor(
    private repository: CustomerRepository,
    private passwordService: PasswordService,
    private authService: AuthService,
    private userRepository: UserRepository,
    private paymentService: PaymentService,
  ) {}

  async create(input: CreateCustomerData) {
    if (input.data.password) input.data.password = await this.passwordService.hashPassword(input.data.password);
    return this.repository.create(input);
  }

  async handleGoogleAuth(input: CreateCustomerData, request: Request) {
    const customer = await this.repository.findByGoogleId(input.data.googleId!);
    if (customer && customer.userId) {
      const user = await this.userRepository.findById(customer?.userId);
      if (user) return this.authService.authenticateUser(user, request);
    }

    if (!customer) {
      await admin
        .auth()
        .createUser({
          email: input.data.email,
          disabled: false,
          displayName: input.data.name,
          uid: input.data.googleId,
          photoURL: input.data.photoURL,
        })
        .catch((e) => e);

      const existsCustomer = await this.repository.findByEmail(input.data.email);
      if (!existsCustomer) {
        const newCustomer = await this.create(input);
        const paymentCustomerId = await this.paymentService.createCustomer(newCustomer);
        newCustomer.paymentCustomerId = paymentCustomerId;
        await this.update(newCustomer.externalId, new UpdateCustomerData(newCustomer));
        const user = await this.userRepository.findById(newCustomer.userId!);
        if (user) {
          return this.authService.authenticateUser(user, request);
        }
      } else {
        const user = await this.userRepository.findById(existsCustomer.userId!);
        if (user) return this.authService.authenticateUser(user, request);
      }
    }
  }

  async update(externalId: ExternalID, updateData: UpdateCustomerData): Promise<Customer | ApplicationError> {
    const existsCustomer = await this.repository.findByExternalId(externalId);
    if (!existsCustomer)
      return new ApplicationError(responseMessages.notFound(responseMessages.customer), HttpStatus.NOT_FOUND);

    const customerFields: CustomerFields = {
      ...existsCustomer,
      ...updateData.data,
    };
    const customer = new Customer(customerFields);

    return this.repository.update(customer);
  }
}
