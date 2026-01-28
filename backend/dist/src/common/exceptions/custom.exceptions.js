"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.NoTicketsInQueueException = exports.TicketNotFoundException = exports.UserNotAuthenticatedException = exports.InvalidCredentialsException = exports.UserAlreadyExistsException = void 0;
const common_1 = require("@nestjs/common");
class UserAlreadyExistsException extends common_1.HttpException {
    constructor() {
        super('Username or email already exists', common_1.HttpStatus.CONFLICT);
    }
}
exports.UserAlreadyExistsException = UserAlreadyExistsException;
class InvalidCredentialsException extends common_1.HttpException {
    constructor() {
        super('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
class UserNotAuthenticatedException extends common_1.HttpException {
    constructor() {
        super('User not authenticated', common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UserNotAuthenticatedException = UserNotAuthenticatedException;
class TicketNotFoundException extends common_1.HttpException {
    constructor() {
        super('Ticket not found', common_1.HttpStatus.NOT_FOUND);
    }
}
exports.TicketNotFoundException = TicketNotFoundException;
class NoTicketsInQueueException extends common_1.HttpException {
    constructor() {
        super('No tickets in queue', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.NoTicketsInQueueException = NoTicketsInQueueException;
class ValidationException extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=custom.exceptions.js.map