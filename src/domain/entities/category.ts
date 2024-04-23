import { ID } from '.';

export interface CategoryFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  parentId: ID | null;
  isFinal: boolean;
}

export class Category implements CategoryFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  parentId: ID | null;
  isFinal: boolean;

  constructor(input: CategoryFields) {
    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.name = input.name;
    this.parentId = input.parentId;
    this.isFinal = input.isFinal;
  }

  nameConflictedInSameParentId(parentId: ID | null): boolean {
    return this.parentId === parentId;
  }
}
