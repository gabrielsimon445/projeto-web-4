"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckSquare,
  Calendar,
  LayoutDashboard,
  Kanban,
  ArrowRight,
  Star,
  Users,
  Zap,
  ChevronRight,
  BarChart3,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Header } from "@/components/shared/header";
import Link from "next/link";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Kanban,
      title: "Quadros Kanban",
      description:
        "Visualize seu fluxo de trabalho com quadros intuitivos de arrastar e soltar. Organize tarefas sem esforço.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Calendar,
      title: "Visualização de calendário",
      description:
        "Visualize todas as suas tarefas em um layout de calendário elegante. Nunca mais perca um prazo.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: LayoutDashboard,
      title: "Painel analítico",
      description:
        "Monitore sua produtividade com insights poderosos. Tome decisões baseadas em dados.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah",
      role: "Gerente de Produto na TechCorp",
      content:
        "O TaskFlow transformou a forma como nossa equipe colabora. Aumentamos a produtividade em 40%.",
    },
    {
      name: "Michael",
      role: "Designer autônomo",
      content:
        "O gerenciador de tarefas mais intuitivo que já usei. A visualização de calendário é revolucionária.",
    },
    {
      name: "Emily",
      role: "Fundador de startups",
      content:
        "Limpo, poderoso e exatamente o que precisávamos. O TaskFlow nos ajudou a escalar com eficiência.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Usuários Ativos" },
    { value: "1M+", label: "Tarefas Completas" },
    { value: "99.9%", label: "Tempo de Atividade" },
    { value: "4.9/5", label: "Avaliação do Usuário" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-24 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-600">
                  Aumente sua produtividade
                </span>
              </div>

              <h1 className="text-5xl md:text-4xl flex flex-col lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                <span>Gerenciar tarefas</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Sem esforço
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A plataforma de produtividade moderna que ajuda as equipes a
                organizar, rastrear e concluir seu trabalho. Bonita, intuitiva e
                poderosa.
              </p>

              <div className="flex flex-wrap gap-4 hover:cursor-pointer">
                <Link
                  href="/login"
                  className="flex items-center py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30"
                >
                  Comece
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <Image
                src="/hero-dashboard.jpeg"
                alt="Dashboard preview"
                width={800}
                height={600}
                className="relative rounded-2xl shadow-2xl border border-gray-200"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tudo o que você precisa para se manter produtivo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Funcionalidades poderosas projetadas para ajudar você e sua equipe
              a alcançar mais.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="h-full border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <feature.icon
                        className="w-7 h-7 text-white"
                        strokeWidth={2}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <Button className="mt-6 text-indigo-600 hover:text-indigo-700 p-0">
                      Saber mais
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Colaboração em equipe
                </h3>
                <p className="text-gray-600">
                  Atribua tarefas, compartilhe atualizações e colabore
                  perfeitamente com sua equipe em tempo real.
                </p>
              </CardContent>
            </div>
            <div className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Acompanhamento do progresso
                </h3>
                <p className="text-gray-600">
                  Monitore sua produtividade com análises e insights detalhados
                  sobre seu fluxo de trabalho.
                </p>
              </CardContent>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Amado por equipes do mundo todo
            </h2>
            <p className="text-xl text-gray-600">
              Veja o que nossos usuários têm a dizer sobre o TaskFlow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-full border-0 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZWMThoNnYxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative z-10">
              <Target className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pronto para aumentar sua produtividade?
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de equipes que já usam o TaskFlow para
                organizar seu trabalho e alcançar seus objetivos.
              </p>
              <div className="bg-white text-indigo-600 hover:bg-gray-50 flex items-center w-fit mx-auto rounded-2xl shadow-xl text-lg px-10 py-6 hover:cursor-pointer">
                <span>Experimente gratuitamente</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
              <p className="text-indigo-100 mt-4">
                Não é necessário cartão de crédito • Plano gratuito para sempre
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">
                  TaskFlow
                </span>
              </div>
              <p className="text-gray-600">
                Gestão moderna de tarefas para equipes produtivas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Registro de alterações
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Carreira
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Termos de Serviço
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-600">
                    Política de Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2025 TaskFlow. Todos direitos reservados.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
