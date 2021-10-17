import { CustomError, FormattedError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database";
  statusCode = 500;

  constructor() {
    super("Database connection error");

    // Only because we are extending a build in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public serializeErrors(): FormattedError[] {
    return [{ message: this.reason }];
  }
}
