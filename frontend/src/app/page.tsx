import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  Zap,
  Shield,
  List,
  Smartphone,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <List className="h-8 w-8 text-teal-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FilaPro</h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Organize seu atendimento
                </p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/register"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Cadastrar
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Entrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-teal-100 text-teal-800 border-teal-300 px-4 py-2 text-sm font-medium">
            🚀 Sistema Completo de Gerenciamento de Filas
          </Badge>

          <h1 className="text-6xl font-black text-gray-900 mb-6 leading-tight animate-fade-in">
            Fila Inteligente para
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-cyan-600">
              Restaurantes & Lanchonetes
            </span>
          </h1>

          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sistema completo de gerenciamento de filas em tempo real. Perfeito
            para fast-food, restaurantes e estabelecimentos que precisam
            organizar o atendimento de forma eficiente e profissional.
          </p>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-bold shadow-lg"
              asChild
            >
              <Link href="/login">
                <List className="mr-3 h-6 w-6" />
                Entrar como Atendente
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
          <Card className="bg-white border-4 border-teal-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
            <CardHeader className="text-center pb-4">
              <Zap className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <CardTitle className="text-teal-800">Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Atualizações instantâneas via WebSocket. Clientes veem seu
                progresso em tempo real.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white border-4 border-blue-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
            <CardHeader className="text-center pb-4">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-blue-800">Interface Moderna</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Design elegante e responsivo, otimizado para tablets e displays
                públicos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white border-4 border-green-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
            <CardHeader className="text-center pb-4">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-800">Sistema Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Autenticação JWT robusta e dados protegidos para operação
                comercial.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Como Funciona
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border-4 border-teal-300">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Cliente Faz Pedido
              </h3>
              <p className="text-gray-600">
                Cliente chega ao estabelecimento e faz seu pedido no balcão. O
                atendente cria um ticket no sistema automaticamente.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-cyan-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border-4 border-cyan-300">
                <span className="text-2xl font-bold text-cyan-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Sistema Organiza Fila
              </h3>
              <p className="text-gray-600">
                O sistema gera uma senha única e organiza a fila por ordem de
                chegada. O painel público mostra todas as senhas disponíveis.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border-4 border-green-300">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Atendimento Eficiente
              </h3>
              <p className="text-gray-600">
                Quando o pedido está pronto, o atendente chama o próximo
                cliente. Sistema reduz tempo de espera e melhora experiência.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-gray-100">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pronto para Revolucionar seu Atendimento?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se aos melhores restaurantes que já usam o FilaPro para
              oferecer uma experiência excepcional aos seus clientes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-bold"
                asChild
              >
                <Link href="/register">
                  <Users className="mr-2 h-5 w-5" />
                  Cadastrar Estabelecimento
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 px-8 py-4 text-lg font-bold"
                asChild
              >
                <Link href="/login">
                  <List className="mr-2 h-5 w-5" />
                  Área Administrativa
                </Link>
              </Button>
            </div>

            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Aumente sua eficiência
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Melhore a experiência do cliente
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Reduza tempos de espera
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
