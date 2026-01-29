import { AuthResponse, RegisterResponse, ApiResponse } from "@/types";
import { API_CONFIG } from "@/lib/config";
import { handleApiError } from "@/lib/error-handling";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: "GET",
      headers,
    });
  }
}

const apiClient = new ApiClient(API_CONFIG.BASE_URL);

export class AuthService {
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    this.validateRegistrationData(username, email, password);

    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      {
        username,
        email,
        password,
      },
    );

    if (
      response.success &&
      response.data &&
      response.data.access_token &&
      response.data.user
    ) {
      return response.data;
    }

    throw new Error("Resposta inválida do servidor");
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    this.validateLoginData(username, password);

    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      {
        username,
        password,
      },
    );

    if (
      response.success &&
      response.data &&
      response.data.access_token &&
      response.data.user
    ) {
      return response.data;
    }

    throw new Error("Resposta inválida do servidor");
  }

  private validateRegistrationData(
    username: string,
    email: string,
    password: string,
  ): void {
    if (!username?.trim()) {
      throw new Error("Nome de usuário é obrigatório");
    }
    if (!email?.trim()) {
      throw new Error("Email é obrigatório");
    }
    if (!password?.trim()) {
      throw new Error("Senha é obrigatória");
    }
    if (password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }
  }

  private validateLoginData(username: string, password: string): void {
    if (!username?.trim()) {
      throw new Error("Nome de usuário é obrigatório");
    }
    if (!password?.trim()) {
      throw new Error("Senha é obrigatória");
    }
  }
}

export const authService = new AuthService();
