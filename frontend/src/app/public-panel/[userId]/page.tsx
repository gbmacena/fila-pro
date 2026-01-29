"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { webSocketService } from "@/services/socket";
import { QueueState } from "@/types";

export default function PublicPanel() {
  const params = useParams();
  const userId = params.userId as string;
  const [queueState, setQueueState] = useState<QueueState>({
    current: null,
    next: [],
    total: 0,
    averageTime: 0,
    estimatedWait: 0,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [currentTicketChanged, setCurrentTicketChanged] = useState(false);
  const currentTicketRef = useRef<string | null>(null);

  useEffect(() => {
    currentTicketRef.current = queueState.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueState.current]);

  useEffect(() => {
    if (!userId) return;

    webSocketService
      .connect(undefined, userId)
      .then(() => {
        setIsConnected(true);
      })
      .catch(() => {
        setIsConnected(false);
      });

    webSocketService.onPublicQueueUpdate((data: QueueState) => {
      if (data.current !== currentTicketRef.current && data.current !== null) {
        setCurrentTicketChanged(true);
        setTimeout(() => setCurrentTicketChanged(false), 2000);
      }
      setQueueState((prev) => ({ ...prev, ...data }));
    });

    return () => {
      webSocketService.disconnect();
    };
  }, [userId]);

  if (!userId) {
    return <div>Carregando...</div>;
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-blue-50 via-teal-50 to-cyan-50"
      role="main"
      aria-label="Painel público da fila"
    >
      {/* Connection Status - Top Right */}
      <div
        className="absolute top-2 right-2 md:top-4 md:right-4 z-10"
        role="status"
        aria-live="polite"
      >
        <Badge
          variant={isConnected ? "secondary" : "destructive"}
          className={`text-xs md:text-sm ${isConnected ? "bg-green-100 text-green-800" : ""}`}
          aria-label={
            isConnected ? "Conectado ao servidor" : "Desconectado do servidor"
          }
        >
          {isConnected ? (
            <>
              <Wifi className="mr-1 h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="mr-1 h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">Offline</span>
            </>
          )}
        </Badge>
      </div>

      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          {/* Current Ticket */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              SENHA ATUAL
            </h2>
            <div className="inline-block relative">
              {/* Animation overlay for ticket change */}
              {currentTicketChanged && (
                <div className="absolute inset-0 bg-linear-to-r from-green-400 to-blue-500 rounded-3xl animate-ping opacity-75"></div>
              )}

              <div
                className={`relative bg-white rounded-3xl px-8 md:px-16 py-8 md:py-12 border-4 shadow-2xl transition-all duration-500 ${
                  currentTicketChanged
                    ? "border-green-500 shadow-green-200 transform scale-110"
                    : "border-teal-500"
                }`}
                role="status"
                aria-live="assertive"
                aria-label={`Senha atual: ${queueState.current || "nenhuma"}`}
              >
                <div
                  className={`text-6xl md:text-9xl font-black transition-all duration-500 ${
                    currentTicketChanged
                      ? "text-green-600 animate-bounce"
                      : "text-gray-900"
                  }`}
                >
                  {queueState.current || "--"}
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="mt-6 md:mt-8 mb-8 md:mb-12">
              <div
                className={`inline-flex items-center space-x-2 md:space-x-3 bg-white rounded-full px-4 md:px-8 py-3 md:py-4 shadow-lg border-2 transition-all duration-300 ${
                  queueState.current
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                role="status"
                aria-label={`Status: ${queueState.current ? "atendimento em andamento" : "aguardando atendimento"}`}
              >
                <div
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                    queueState.current
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                ></div>
                <span
                  className={`text-sm md:text-lg font-semibold transition-colors duration-300 ${
                    queueState.current ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {queueState.current ? "ATENDIMENTO" : "AGUARDANDO"}
                </span>
              </div>
            </div>
          </div>

          {/* Next Tickets */}
          <div
            className="mb-8"
            role="region"
            aria-label="Próximas senhas na fila"
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-4 md:mb-6">
              PRÓXIMAS SENHAS
            </h3>
            <div className="flex justify-center flex-wrap gap-2 md:gap-4 max-w-4xl mx-auto px-2">
              {queueState.next.slice(0, 5).map((ticket, index) => (
                <div
                  key={`${ticket.code}-${index}`}
                  className={`relative group transition-all duration-300 hover:scale-105 ${
                    index === 0 ? "order-first" : ""
                  }`}
                >
                  {/* Glow effect for next ticket */}
                  {index === 0 && (
                    <div className="absolute -inset-1 md:-inset-2 bg-linear-to-r from-blue-400 to-teal-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                  )}

                  <div
                    className={`relative text-center px-4 md:px-8 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-3xl border-2 shadow-lg transition-all duration-300 ${
                      index === 0
                        ? "bg-linear-to-br from-blue-500 to-teal-600 text-white border-blue-400 shadow-blue-200 transform scale-105"
                        : "bg-white text-gray-800 border-gray-300 hover:border-teal-400"
                    }`}
                  >
                    <div className="mb-1 md:mb-2">{ticket.code}</div>
                    {index === 0 && (
                      <div className="text-xs md:text-sm font-normal opacity-90 animate-bounce">
                        <span className="hidden sm:inline">PRÓXIMO →</span>
                        <span className="sm:hidden">→</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
