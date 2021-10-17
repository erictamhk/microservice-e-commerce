import { CustomError, FormattedError } from "./custom-error";

export class NotFoundError extends CustomError {
  reason = "Not Found";
  statusCode = 404;

  constructor() {
    super("Route Not Found");

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeErrors(): FormattedError[] {
    return [{ message: this.reason }];
  }
}
