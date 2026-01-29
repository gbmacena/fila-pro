import { ERROR_MESSAGES } from "./config";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes("fetch")) {
      return new AppError(ERROR_MESSAGES.NETWORK_ERROR, 0, error);
    }

    const statusMatch = error.message.match(/HTTP (\d+)/);
    if (statusMatch) {
      const statusCode = parseInt(statusMatch[1]);
      switch (statusCode) {
        case 401:
          return new AppError(ERROR_MESSAGES.UNAUTHORIZED, statusCode, error);
        case 403:
          return new AppError(ERROR_MESSAGES.FORBIDDEN, statusCode, error);
        case 404:
          return new AppError(ERROR_MESSAGES.NOT_FOUND, statusCode, error);
        case 500:
          return new AppError(ERROR_MESSAGES.SERVER_ERROR, statusCode, error);
        default:
          return new AppError(error.message, statusCode, error);
      }
    }

    return new AppError(error.message, undefined, error);
  }

  return new AppError(ERROR_MESSAGES.SERVER_ERROR, 500, error);
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AppError && error.statusCode === 0;
};

export const isAuthError = (error: unknown): boolean => {
  return (
    error instanceof AppError &&
    (error.statusCode === 401 || error.statusCode === 403)
  );
};
