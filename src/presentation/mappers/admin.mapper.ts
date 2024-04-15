import { Admin, User } from '@prisma/client';
import { AdminWithUserResponse } from '../response/admin.response';

export const AdminMapper = {
  getToResponse: (input: Admin & { user: User | null }): AdminWithUserResponse => {
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
