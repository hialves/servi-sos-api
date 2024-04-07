import { ID } from '../../domain/entities';

interface Node {
  id: ID;
}

export interface PaginatedResult<T extends Node> {
  items: Array<T>;
  totalItems: number;
}
