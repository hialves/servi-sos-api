import { Customer, User } from '@prisma/client';
import { CustomerResponse } from '../response/customer.response';

export const CustomerMapper = {
  getToResponse: (input: Customer & { user: User | null }): CustomerResponse => {
    const { id: _, userId: __, externalId, user, ...rest } = input;
    return {
      ...rest,
      id: externalId,
      user: user && {
        id: user.externalId,
        lastLogin: user.lastLogin,
        role: user.role,
      },
    };
  },
};
