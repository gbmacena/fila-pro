import { HttpException } from '@nestjs/common';
export declare class UserAlreadyExistsException extends HttpException {
    constructor();
}
export declare class InvalidCredentialsException extends HttpException {
    constructor();
}
export declare class UserNotAuthenticatedException extends HttpException {
    constructor();
}
export declare class TicketNotFoundException extends HttpException {
    constructor();
}
export declare class NoTicketsInQueueException extends HttpException {
    constructor();
}
export declare class ValidationException extends HttpException {
    constructor(message: string);
}
