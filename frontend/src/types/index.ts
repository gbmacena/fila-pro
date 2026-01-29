// API Types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export type RegisterResponse = AuthResponse;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface QueueState {
  current: string | null;
  next: Array<{
    code: string;
    position: number;
    estimatedWait: number;
  }>;
  total: number;
  averageTime: number;
  estimatedWait: number;
}

export interface TicketResponse {
  code: string;
  position: number;
  estimatedWait?: number;
}

export interface MyPosition {
  position: number;
  estimatedWait: number;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

// WebSocket Events
export interface QueueUpdateEvent {
  type: "queue_update";
  data: QueueState;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
