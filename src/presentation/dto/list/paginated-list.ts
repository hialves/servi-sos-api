export class PaginatedList<T> {
  constructor(
    public items: Array<T>,
    public totalItems: number,
  ) {}
}
