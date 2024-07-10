import type { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { json } from 'express';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    json({ limit: '10mb' })(req, res, next);
  }
}
