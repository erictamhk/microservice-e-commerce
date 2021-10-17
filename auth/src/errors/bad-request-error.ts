import { CustomError, FormattedError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public serializeErrors(): FormattedError[] {
    return [{ message: this.message }];
  }
}
