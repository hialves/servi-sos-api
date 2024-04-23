import { HttpStatus } from '@nestjs/common';

export class ApplicationError<T = unknown> {
  constructor(
    public message: string,
    public httpStatus: HttpStatus = 400,
    public data?: T,
  ) {}
}
