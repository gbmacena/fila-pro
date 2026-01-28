"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserId = void 0;
const common_1 = require("@nestjs/common");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
exports.UserId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user?.userId;
    if (!userId) {
        throw new custom_exceptions_1.UserNotAuthenticatedException();
    }
    return userId;
});
//# sourceMappingURL=user-id.decorator.js.map