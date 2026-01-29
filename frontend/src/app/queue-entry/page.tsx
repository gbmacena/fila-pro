"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Ticket, Clock, CheckCircle } from "lucide-react";
import { ticketService } from "@/services/tickets";
import { TicketResponse } from "@/types";
import { toast } from "sonner";

export default function QueueEntry() {
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoinQueue = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Faça login primeiro");
        return;
      }

      const response = await ticketService.createTicket(token);
      setTicket(response);
      toast.success("Ticket criado com sucesso!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(message || "Erro ao entrar na fila");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number | undefined) => {
    if (!minutes || minutes < 60) {
      return `${minutes || 0} minutos`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              FilaPro - Entrada na Fila
            </h1>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Ir para Dashboard</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {!ticket ? (
            <Card>
              <CardHeader className="text-center">
                <Ticket className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">Entrar na Fila</CardTitle>
                <p className="text-gray-600">
                  Clique no botão abaixo para receber sua senha e acompanhar o
                  andamento da fila.
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleJoinQueue}
                  disabled={loading}
                >
                  {loading ? (
                    "Gerando ticket..."
                  ) : (
                    <>
                      <Ticket className="mr-2 h-5 w-5" />
                      Entrar na Fila
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-2xl text-green-800">
                  Ticket Gerado!
                </CardTitle>
                <p className="text-green-700">
                  Sua senha foi criada com sucesso. Acompanhe o andamento no
                  painel público.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-2">
                    {ticket.code}
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Sua Senha
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {ticket.position}
                    </div>
                    <div className="text-sm text-gray-600">Sua posição</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatTime(ticket.estimatedWait)}
                    </div>
                    <div className="text-sm text-gray-600">Tempo estimado</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard">
                      <Clock className="mr-2 h-4 w-4" />
                      Ver no Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setTicket(null)}
                  >
                    Gerar Novo Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
