import { Admin, User } from '@prisma/client';
import { AdminWithUserResponse } from '../response/admin.response';

export const AdminMapper = {
  toHTTP: (admin: Admin & { user: User | null }): AdminWithUserResponse => {
    const { user } = admin;

    return {
      id: admin.id,
      externalId: admin.externalId,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      name: admin.name,
      email: admin.email,
      assetId: admin.assetId,
      user: user && {
        id: user.id,
        lastLogin: user.lastLogin,
        role: user.role,
      },
    };
  },
};
