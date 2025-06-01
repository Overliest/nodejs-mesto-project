import { StatusCode } from "../utils";

export class NotFoundError extends Error {
  statusCode: StatusCode;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = StatusCode.NOT_FOUND;
  }
}

export class BadRequestError extends Error {
  statusCode: StatusCode;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = StatusCode.BAD_REQUEST;
  }
}

export class UnauthorizedError extends Error {
  statusCode: StatusCode;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = StatusCode.UNAUTHORIZED;
  }
}
