"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    data;
    message;
    error;
    timestamp;
    constructor(success, data, message, error) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
        this.timestamp = new Date();
    }
    static success(data, message) {
        return new ApiResponse(true, data, message);
    }
    static error(error, message) {
        return new ApiResponse(false, undefined, message, error);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.dto.js.map