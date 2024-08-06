import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isAppError } from '../helpers/application-error.helper';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ApplicationErrorInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((value) => {
        if (isAppError(value)) {
          throw new HttpException({ message: value.message, data: value.data }, value.httpStatus);
        }
        return value;
      }),
    );
  }
}
