import { ID } from '../entities';

export class CreateCategoryData {
  constructor(public data: { name: string; parentId?: ID; isFinal?: boolean }) {}
}
