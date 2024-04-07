import { ID } from '../entities';

export class UpdateAdminData {
  constructor(public data: { name?: string; email?: string; assetId?: ID | null; userId?: ID | null }) {}
}
