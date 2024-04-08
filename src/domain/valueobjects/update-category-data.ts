import { ID } from '../entities';

export class UpdateCategoryData {
  constructor(public data: { name?: string; parentId?: ID; isFinal?: boolean }) {}
}
