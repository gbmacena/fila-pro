import { QueueState, MyPosition, ApiResponse } from "@/types";
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

export class QueueService {
  async getPublicState(userId: string): Promise<ApiResponse<QueueState>> {
    if (!userId?.trim()) {
      throw new Error("ID do usuário é obrigatório");
    }

    return apiClient.get<ApiResponse<QueueState>>(
      `/queue/public-state/${userId}`,
    );
  }

  async getMyPosition(ticketCode: string): Promise<MyPosition> {
    if (!ticketCode?.trim()) {
      throw new Error("Código do ticket é obrigatório");
    }

    return apiClient.get<MyPosition>(`/queue/my-position/${ticketCode}`);
  }

  async getAdminState(token: string): Promise<QueueState> {
    if (!token?.trim()) {
      throw new Error("Token de autenticação é obrigatório");
    }

    const response = await apiClient.get<ApiResponse<QueueState>>(
      "/queue/state",
      token,
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error("Resposta inválida do servidor");
  }

  async callNext(token: string): Promise<QueueState> {
    if (!token?.trim()) {
      throw new Error("Token de autenticação é obrigatório");
    }

    return apiClient.post<QueueState>("/queue/call-next", token);
  }

  async finish(token: string): Promise<QueueState> {
    if (!token?.trim()) {
      throw new Error("Token de autenticação é obrigatório");
    }

    return apiClient.post<QueueState>("/queue/finish", token);
  }
}

export const queueService = new QueueService();
