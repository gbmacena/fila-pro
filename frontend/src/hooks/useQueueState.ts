"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QueueState } from "@/types";
import { queueService } from "@/services/queue";
import { webSocketService } from "@/services/socket";
import { STORAGE_KEYS } from "@/lib/config";

interface UseQueueStateOptions {
  autoConnect?: boolean;
  onError?: (error: Error) => void;
}

interface UseQueueStateReturn {
  queueState: QueueState;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  callNext: () => Promise<void>;
  finish: () => Promise<void>;
  refetch: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const initialQueueState: QueueState = {
  current: null,
  next: [],
  total: 0,
  averageTime: 0,
  estimatedWait: 0,
};

export const useQueueState = (
  token?: string | null,
  options: UseQueueStateOptions = {},
): UseQueueStateReturn => {
  const { autoConnect = true, onError } = options;

  const [queueState, setQueueState] = useState<QueueState>(initialQueueState);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tokenRef = useRef(token);
  tokenRef.current = token;

  const handleError = useCallback(
    (error: Error) => {
      setError(error.message);
      onError?.(error);
    },
    [onError],
  );

  const connect = useCallback(async () => {
    try {
      const authToken =
        tokenRef.current || localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      await webSocketService.connect(authToken);
      setIsConnected(true);

      webSocketService.onQueueUpdate((data: QueueState) => {
        setQueueState({ ...initialQueueState, ...data });
        setError(null);
      });
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
  }, []);

  const fetchQueueState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const authToken =
        tokenRef.current || localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      const data = await queueService.getAdminState(authToken);
      setQueueState({ ...initialQueueState, ...data });
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const callNext = useCallback(async () => {
    try {
      setError(null);
      const authToken =
        tokenRef.current || localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      await queueService.callNext(authToken);
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleError]);

  const finish = useCallback(async () => {
    try {
      setError(null);
      const authToken =
        tokenRef.current || localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      await queueService.finish(authToken);
    } catch (error) {
      handleError(error as Error);
      throw error;
    }
  }, [handleError]);

  const refetch = useCallback(async () => {
    await fetchQueueState();
  }, [fetchQueueState]);

  useEffect(() => {
    if (autoConnect) {
      connect();
      fetchQueueState();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect, fetchQueueState]);

  return {
    queueState,
    isConnected,
    isLoading,
    error,
    callNext,
    finish,
    refetch,
    connect,
    disconnect,
  };
};
