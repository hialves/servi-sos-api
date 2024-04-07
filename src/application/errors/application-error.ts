import { HttpStatus } from '@nestjs/common';

export class ApplicationError<T = unknown> {
  constructor(
    public message: string,
    public data?: T,
    public httpStatus?: HttpStatus,
  ) {}
}
