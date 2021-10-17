import { ValidationError } from "express-validator";
import { CustomError, FormattedError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serializeErrors(): FormattedError[] {
    return this.errors.map((error): FormattedError => {
      return {
        message: error.msg,
        field: error.param,
      };
    });
  }
}
