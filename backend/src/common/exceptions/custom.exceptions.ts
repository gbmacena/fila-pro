import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('Username or email already exists', HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotAuthenticatedException extends HttpException {
  constructor() {
    super('User not authenticated', HttpStatus.UNAUTHORIZED);
  }
}

export class TicketNotFoundException extends HttpException {
  constructor() {
    super('Ticket not found', HttpStatus.NOT_FOUND);
  }
}

export class NoTicketsInQueueException extends HttpException {
  constructor() {
    super('No tickets in queue', HttpStatus.BAD_REQUEST);
  }
}

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
