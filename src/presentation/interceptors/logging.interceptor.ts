import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.logHttpCall(context, next);
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest() as Request;
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    request.requestId = crypto.randomUUID();
    let partialToken: string = '';

    if (request.headers.authorization) {
      const token = request.headers?.authorization?.split('Bearer ').join('');
      partialToken = token.slice(0, token.length * 0.1).padEnd(token.length / 3, '*');
    }

    this.logger.log(
      `[${request.requestId}] ${method} ${url} ${partialToken} ${userAgent} ${ip}: ${context.getClass().name} ${
        context.getHandler().name
      }`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();

        const { statusCode } = response;
        const contentLength = response.get('content-length');

        this.logger.log(
          `[${request.requestId}] ${method} ${url} ${statusCode} ${contentLength}: ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
