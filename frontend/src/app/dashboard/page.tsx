"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useQueueState } from "@/hooks/useQueueState";
import { useTicket } from "@/hooks/useTicket";
import {
  Users,
  Play,
  Square,
  LogOut,
  TrendingUp,
  Wifi,
  WifiOff,
  Plus,
  Ticket,
  List,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, token, logout, isAuthenticated, isLoading } = useAuth();
  const { queueState, isConnected, callNext, finish, refetch } =
    useQueueState(token);
  const { createTicket, isLoading: creatingTicket } = useTicket({
    onSuccess: async (ticket) => {
      toast.success(`Ticket ${ticket.code} criado com sucesso!`);
      await refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleCallNext = async () => {
    try {
      await callNext();
      toast.success("Próximo ticket chamado!");
      await refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(message || "Erro ao chamar próximo ticket");
    }
  };

  const handleFinish = async () => {
    try {
      await finish();
      toast.success("Atendimento finalizado!");
      await refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(message || "Erro ao finalizar atendimento");
    }
  };

  const handleCreateTicket = async () => {
    try {
      await createTicket();
    } catch {}
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Logout realizado com sucesso!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-teal-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <List className="h-8 w-8 text-teal-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">FilaPro</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <Wifi className="mr-1 h-3 w-3" />
                    Online
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                  >
                    <WifiOff className="mr-1 h-3 w-3" />
                    Offline
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-600 hidden sm:block">
                Olá, {user?.username}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Current Service */}
          <Card className="lg:col-span-2 bg-white border-4 border-teal-200 shadow-xl">
            <CardHeader className="bg-teal-50 border-b-4 border-teal-200">
              <CardTitle className="text-center text-xl text-teal-800 flex items-center justify-center">
                <Ticket className="mr-2 h-6 w-6" />
                Em Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8">
              <div className="text-8xl font-black text-teal-600 mb-6 bg-teal-50 rounded-2xl py-8 border-4 border-teal-300">
                {queueState.current || "--"}
              </div>
              <p className="text-gray-600 mb-8 text-lg">
                {queueState.current
                  ? "Cliente sendo atendido no balcão"
                  : "Aguardando próximo cliente"}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg"
                  onClick={handleCallNext}
                  disabled={queueState.next.length === 0}
                >
                  <Play className="mr-2 h-6 w-6" />
                  Chamar Próximo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-4 text-lg"
                  onClick={handleFinish}
                  disabled={!queueState.current}
                >
                  <Square className="mr-2 h-6 w-6" />
                  Finalizar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create New Ticket */}
          <Card className="lg:col-span-2 bg-white shadow-sm border">
            <CardHeader className="border-b">
              <CardTitle className="text-center text-lg text-gray-900 flex items-center justify-center">
                <Plus className="mr-2 h-5 w-5" />
                Novo Pedido
              </CardTitle>
              <CardDescription className="text-center">
                Criar ticket para novo cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-6">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {queueState.total + 1}
                </div>
                <div className="text-sm text-gray-600">Próxima posição</div>
              </div>

              <Button
                size="lg"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4"
                onClick={handleCreateTicket}
                disabled={creatingTicket}
              >
                {creatingTicket ? (
                  "Criando..."
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Criar Ticket
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Queue List */}
          <Card className="lg:col-span-2 bg-white border-4 border-yellow-200 shadow-xl">
            <CardHeader className="bg-yellow-50 border-b-4 border-yellow-200">
              <CardTitle className="text-center text-lg text-yellow-800 flex items-center justify-center">
                <Users className="mr-2 h-5 w-5" />
                Fila de Espera
              </CardTitle>
              <CardDescription className="text-center">
                {queueState.total} cliente{queueState.total !== 1 ? "s" : ""}{" "}
                aguardando
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {queueState.next.length > 0 ? (
                  queueState.next.map((ticket, index) => (
                    <div
                      key={`${ticket.code}-${index}`}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-md ${
                        index === 0
                          ? "bg-yellow-100 border-yellow-400 shadow-yellow-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`text-2xl font-black px-3 py-1 rounded-lg ${
                            index === 0
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {ticket.code}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {ticket.code}
                          </div>
                          <div className="text-sm text-gray-600">
                            {index} pessoa{index !== 1 ? "s" : ""} na frente
                          </div>
                          {index === 0 && (
                            <div className="text-sm text-yellow-700 font-medium">
                              PRÓXIMO A SER CHAMADO
                            </div>
                          )}
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge className="bg-yellow-500 text-white font-bold">
                          Pronto!
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <div className="text-gray-500 text-lg font-medium">
                      Nenhum cliente aguardando
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                      Use &quot;Criar Ticket&quot; quando um cliente fizer um
                      pedido
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Future Features */}
          <Card className="lg:col-span-2 bg-white border-4 border-purple-200 shadow-xl border-dashed">
            <CardHeader className="bg-purple-50 border-b-4 border-purple-200">
              <CardTitle className="text-center text-lg text-purple-800 flex items-center justify-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Previsão Inteligente
              </CardTitle>
              <CardDescription className="text-center">
                Funcionalidade em desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8">
              <div className="text-6xl font-bold text-purple-300 mb-4">--</div>
              <p className="text-gray-600 mb-4">
                Sistema de IA para prever demanda e otimizar atendimento baseado
                em:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-purple-50 p-3 rounded-lg">
                  📊 Padrões históricos
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  🕐 Horários de pico
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  📈 Tendências sazonais
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  ⚡ Otimização automática
                </div>
              </div>
              <Badge
                variant="outline"
                className="mt-6 border-purple-300 text-purple-600"
              >
                Em breve
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-linear-to-r from-blue-50 to-teal-50 border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-blue-800 flex items-center justify-center">
              <Eye className="mr-2 h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              variant="default"
              size="lg"
              asChild
              className="bg-blue-600 hover:bg-blue-700"
            >
              <a
                href={`/public-panel/${user?.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Painel Público
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
