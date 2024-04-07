import { ID } from '../entities';

export class UpdateCustomerData {
  constructor(
    public data: { name?: string; email?: string; phone?: string | null; assetId?: ID | null; userId?: ID | null },
  ) {}
}
