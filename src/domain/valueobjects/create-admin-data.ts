import { Role } from '@prisma/client';

export class CreateAdminData {
  constructor(public data: { name: string; email: string; password?: string; role: Role }) {}
}
