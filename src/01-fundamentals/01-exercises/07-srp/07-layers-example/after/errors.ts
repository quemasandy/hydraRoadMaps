export class InvalidEmailError extends Error {
  statusCode: number;
  constructor() {
    super("Invalid email format");
    this.name = "InvalidEmailError";
    this.statusCode = 400;
  }
}

export class InvalidPasswordError extends Error {
  statusCode: number;
  constructor() {
    super("Password must be at least 6 characters long");
    this.name = "InvalidPasswordError";
    this.statusCode = 400;
  }
}

export class InvalidEmailDomainError extends Error {
  statusCode: number;
  constructor() {
    super("Invalid email domain");
    this.name = "InvalidEmailDomainError";
    this.statusCode = 400;
  }
}

export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
  }
}
