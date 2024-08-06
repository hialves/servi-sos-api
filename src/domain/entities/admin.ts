import { ExternalID, ID } from '.';

export interface AdminFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  assetId: ID | null;
  userId: ID | null;
  externalId: ExternalID;
}

export class Admin {
  private props: AdminFields;

  constructor(input: AdminFields) {
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
  get email() {
    return this.props.email;
  }
  set email(value: string) {
    this.props.email = value;
  }
  get assetId() {
    return this.props.assetId;
  }
  set assetId(value: number | null) {
    this.props.assetId = value;
  }
  get userId() {
    return this.props.userId;
  }
  set userId(value: number | null) {
    this.props.userId = value;
  }
  get externalId() {
    return this.props.externalId;
  }
}
