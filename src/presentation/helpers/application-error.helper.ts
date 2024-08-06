import { ApplicationError } from '../../application/errors/application-error';

export function isAppError<T>(value: T | ApplicationError): value is ApplicationError {
  return value instanceof ApplicationError;
}
