import { ValidationError as ClassValidatorError } from 'class-validator';
import { responseMessages } from '../../application/messages/response.messages';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export class DefaultResult {
  public success: boolean;

  public message: string;
  constructor(success: boolean, message: string = '') {
    this.success = success;
    this.message = message;
  }
}

export class ErrorResult extends DefaultResult {
  constructor(message: string = '') {
    super(false, message);
  }
}

export const DeletionMessage = {
  success: responseMessages.delete.success,
  fail: responseMessages.delete.fail,
};

export class DeleteResult extends DefaultResult {
  public success: boolean;
  public message: string;

  constructor(success: boolean, message: string = '') {
    super(success, message);

    if (!this.message) {
      this.message = success ? DeletionMessage.success : DeletionMessage.fail;
    }
  }
}

export class NotFoundError extends NotFoundException {
  constructor(
    public message: string,
    public resourceId: string = '',
  ) {
    super({ message, resourceId });
  }
}

export class ValidationKey {
  public key: string;
  public message: string;

  constructor(key: string, message: string) {
    this.key = key;
    this.message = message;
  }
}

export class ValidationError {
  public errors: Array<ValidationKey>;
  public message: string;

  constructor(errors: Array<ClassValidatorError | ValidationKey>, message: string = responseMessages.form.someErrors) {
    this.errors = errors.map((error) => {
      if (error instanceof ValidationKey) {
        return error;
      }

      return new ValidationKey(error.property, error.constraints ? Object.values(error.constraints).join(', ') : '');
    });
    this.message = message;
  }
}

export class InvalidCredentialsError extends UnauthorizedException {
  constructor() {
    super(responseMessages.auth.invalidCredentials);
  }
}
