import { Admin, User } from '@prisma/client';
import { AdminResponse } from '../response/admin.response';

export const AdminMapper = {
  getToResponse: (input: Admin & { user: User | null }): AdminResponse => {
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
