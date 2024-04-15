import { Customer, User } from '@prisma/client';
import { CustomerWithUserResponse } from '../response/customer.response';

export const CustomerMapper = {
  getToResponse: (input: Customer & { user: User | null }): CustomerWithUserResponse => {
    const { userId: __, user, ...rest } = input;
    return {
      ...rest,
      user: user && {
        id: user.id,
        lastLogin: user.lastLogin,
        role: user.role,
      },
    };
  },
};
