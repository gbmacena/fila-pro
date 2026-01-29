import { TicketResponse, ApiResponse } from "@/types";
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

  async post<T>(
    endpoint: string,
    token?: string,
    data?: Record<string, unknown>,
  ): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

const apiClient = new ApiClient(API_CONFIG.BASE_URL);

export class TicketService {
  async createTicket(token: string): Promise<TicketResponse> {
    if (!token?.trim()) {
      throw new Error("Token de autenticação é obrigatório");
    }

    const response = await apiClient.post<
      ApiResponse<{ code: string; position: number }>
    >("/tickets", token);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Resposta inválida do servidor");
  }
}

export const ticketService = new TicketService();
