import { CustomError, FormattedError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  public serializeErrors(): FormattedError[] {
    return [{ message: "Not Authorized" }];
  }
}
