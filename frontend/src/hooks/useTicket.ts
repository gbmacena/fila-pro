import { useState, useCallback } from "react";
import { TicketResponse } from "@/types";
import { ticketService } from "@/services/tickets";
import { STORAGE_KEYS } from "@/lib/config";

interface UseTicketOptions {
  onSuccess?: (ticket: TicketResponse) => void;
  onError?: (error: Error) => void;
}

interface UseTicketReturn {
  ticket: TicketResponse | null;
  isLoading: boolean;
  error: string | null;
  createTicket: () => Promise<TicketResponse | null>;
  reset: () => void;
}

export const useTicket = (options: UseTicketOptions = {}): UseTicketReturn => {
  const { onSuccess, onError } = options;

  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = useCallback(async (): Promise<TicketResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const newTicket = await ticketService.createTicket(token);
      setTicket(newTicket);

      onSuccess?.(newTicket);
      return newTicket;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar ticket";
      setError(errorMessage);
      onError?.(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setTicket(null);
    setError(null);
  }, []);

  return {
    ticket,
    isLoading,
    error,
    createTicket,
    reset,
  };
};
