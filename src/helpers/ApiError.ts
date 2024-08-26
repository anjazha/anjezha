import { EHttpStatusCode } from "../Application/interfaces/enums/EHttpStatusCode";
class ApiError extends Error {
  public readonly name: string;
  public readonly httpCode: EHttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: EHttpStatusCode,
    message: string,
    isOperational: boolean
  ) {
    super(message);

    // to make the error prototype be different depending on the instance we created
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export class HTTP400Error extends ApiError {
  constructor(message = "bad request") {
    super("BAD REQUEST", EHttpStatusCode.BAD_REQUEST, message, true);
  }
}
export class HTTP404Error extends ApiError {
  constructor(message = "not found") {
    super("NOT FOUND", EHttpStatusCode.NOT_FOUND, message, true);
  }
}
export class HTTP401Error extends ApiError {
  constructor(message = "not authenticated") {
    super(
      "NOT AUTHENTICATED",
      EHttpStatusCode.NOT_AUTHENTICATED,
      message,
      true
    );
  }
}
export class HTTP403Error extends ApiError {
  constructor(message = "forbidden") {
    super("FORBIDDEN", EHttpStatusCode.FORBIDDEN, message, true);
  }
}
export class HTTP500Error extends ApiError {
  constructor(message = "internal server error") {
    super("INTERNAL ERROR", EHttpStatusCode.INTERNAL_SERVER, message, false);
  }
}
