"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueEvents = exports.TicketStatus = exports.DEFAULT_AVERAGE_TIME = exports.TICKET_CODE_LENGTH = exports.TICKET_CODE_PREFIX = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRES_IN = '12h';
exports.TICKET_CODE_PREFIX = 'A';
exports.TICKET_CODE_LENGTH = 3;
exports.DEFAULT_AVERAGE_TIME = 3;
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["WAITING"] = "WAITING";
    TicketStatus["CALLING"] = "CALLING";
    TicketStatus["DONE"] = "DONE";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var QueueEvents;
(function (QueueEvents) {
    QueueEvents["QUEUE_UPDATE"] = "queueUpdate";
    QueueEvents["PUBLIC_QUEUE_UPDATE"] = "publicQueueUpdate";
})(QueueEvents || (exports.QueueEvents = QueueEvents = {}));
//# sourceMappingURL=app.constants.js.map