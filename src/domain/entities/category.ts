import { ID } from '.';

export interface CategoryFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  parentId: ID | null;
  isFinal: boolean;
}

export class Category {
  private props: CategoryFields;

  constructor(input: CategoryFields) {
    this.props = input;
  }

  get id() {
    return this.props.id;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get name() {
    return this.props.name;
  }
  set name(value: string) {
    this.props.name = value;
  }
  get parentId() {
    return this.props.parentId;
  }
  set parentId(value: number | null) {
    this.props.parentId = value;
  }
  get isFinal() {
    return this.props.isFinal;
  }
  set isFinal(value: boolean) {
    this.props.isFinal = value;
  }

  nameConflictedInSameParentId(parentId: ID | null): boolean {
    return this.parentId === parentId;
  }
}
