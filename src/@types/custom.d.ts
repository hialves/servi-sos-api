import { UserSession } from '../infra/interfaces/user-session.interface';

declare global {
  namespace Express {
    export interface Request {
      requestId?: string;
      session?: UserSession;
    }
  }
}
