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

export class Admin implements AdminFields {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  assetId: ID | null;
  userId: ID | null;
  externalId: ExternalID;

  constructor(input: AdminFields) {
    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.name = input.name;
    this.email = input.email;
    this.assetId = input.assetId;
    this.userId = input.userId;
    this.externalId = input.externalId;
  }
}
