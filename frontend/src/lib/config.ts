export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Erro de rede. Verifique sua conexão.",
  UNAUTHORIZED: "Sessão expirada. Faça login novamente.",
  FORBIDDEN: "Acesso negado.",
  NOT_FOUND: "Recurso não encontrado.",
  SERVER_ERROR: "Erro interno do servidor.",
  VALIDATION_ERROR: "Dados inválidos.",
} as const;
