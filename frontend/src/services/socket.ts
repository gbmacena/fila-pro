import { io, Socket } from "socket.io-client";
import { QueueState } from "@/types";
import { API_CONFIG } from "@/lib/config";

type QueueUpdateCallback = (data: QueueState) => void;

export class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token?: string, userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      const WS_URL = API_CONFIG.WS_URL;

      try {
        this.socket = io(WS_URL, {
          auth: token ? { token } : userId ? { userId } : undefined,
          timeout: 5000,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
        });

        this.socket.on("connect", () => {
          console.log("Conectado ao WebSocket");
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on("disconnect", (reason) => {
          console.log("Desconectado do WebSocket:", reason);
        });

        this.socket.on("connect_error", (error) => {
          console.error("Erro de conexão WebSocket:", error);
          this.reconnectAttempts++;

          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            reject(
              new Error(
                "Falha ao conectar ao WebSocket após várias tentativas",
              ),
            );
          }
        });
      } catch {
        reject(new Error("Erro ao inicializar WebSocket"));
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onQueueUpdate(callback: QueueUpdateCallback): void {
    if (!this.socket) {
      console.warn("WebSocket não conectado");
      return;
    }

    this.socket.on("queueUpdate", callback);
  }

  onPublicQueueUpdate(callback: QueueUpdateCallback): void {
    if (!this.socket) {
      console.warn("WebSocket não conectado");
      return;
    }

    this.socket.on("publicQueueUpdate", callback);
  }

  offQueueUpdate(callback?: QueueUpdateCallback): void {
    if (!this.socket) return;

    if (callback) {
      this.socket.off("queue_update", callback);
    } else {
      this.socket.off("queue_update");
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getConnectionState(): string {
    if (!this.socket) return "disconnected";
    return this.socket.connected ? "connected" : "connecting";
  }
}

export const webSocketService = new WebSocketService();
