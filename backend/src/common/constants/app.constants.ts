export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = '12h';

export const TICKET_CODE_PREFIX = 'A';
export const TICKET_CODE_LENGTH = 3;

export const DEFAULT_AVERAGE_TIME = 3;

export enum TicketStatus {
  WAITING = 'WAITING',
  CALLING = 'CALLING',
  DONE = 'DONE',
}

export enum QueueEvents {
  QUEUE_UPDATE = 'queueUpdate',
  PUBLIC_QUEUE_UPDATE = 'publicQueueUpdate',
}
