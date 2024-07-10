import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import { raw } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    raw({ type: '*/*' })(req, res, next);
  }
}
