import { Role } from '@prisma/client';

export class CreateCustomerData {
  constructor(public data: { name: string; email: string; password?: string; role: Role; phone?: string }) {}
}
