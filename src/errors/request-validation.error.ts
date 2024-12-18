import { ValidationError } from "express-validator";
import CustomError from "./custom.error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid Request");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err: any) => {
      return {
        message: err.msg,
        field: err.path,
      };
    });
  }
}
