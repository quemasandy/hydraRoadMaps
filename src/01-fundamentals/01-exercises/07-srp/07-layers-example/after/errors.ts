export interface HttpErrorResponse {
  status: number;
  body: {
    success: false;
    data: { error: string };
  }
}

abstract class SystemError extends Error {
  statusCode: number;
  constructor(args: {message: string, statusCode: number }) {
    super(args.message);
    this.name = "SystemError";
    this.statusCode = args.statusCode;
  }
  toHttpError(): HttpErrorResponse {
    return {
      status: this.statusCode,
      body: {
        success: false,
        data: { error: this.message }
      }
    };
  }
}

export class InvalidEmailError extends SystemError {
  constructor() {
    super({message: "Invalid email format", statusCode: 400});
    this.name = "InvalidEmailError";
  }
}

export class InvalidPasswordError extends SystemError {
  constructor() {
    super({message: "Password must be at least 6 characters long", statusCode: 400});
    this.name = "InvalidPasswordError";
  }
}

export class InvalidEmailDomainError extends SystemError {
  constructor() {
    super({message: "Invalid email domain", statusCode: 400});
    this.name = "InvalidEmailDomainError";
  }
}

export class CustomError extends SystemError {
  constructor(args: {message: string, statusCode: number}) {
    super(args);
    this.name = "CustomError";
  }
}
