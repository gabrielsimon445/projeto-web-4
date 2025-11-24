"use client";

import { cotacao, getCripto, getDolar } from "@/app/api";
import { PizzaGraph } from "@/components/features/dashboard/PizzaGraph";
import { Card } from "@/components/shared/card";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  CheckCircle2,
  CircleAlertIcon,
  Clock,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TaskInfo } from "./components/TaskInfo";
import TaskModal from "./components/TaskModal";

interface Transaction {
  id: string;
  value: number;
  type: "receita" | "despesa";
  category: string;
  createdAt?: unknown;
}
interface Bill {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  createdAt?: unknown;
}

export default function DashboardPage() {
  const router = useRouter();
  const [selectTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [bills, setBills] = useState<Bill[]>([]);
  const [despesasCategoria, setDespesasCategoria] = useState([
    { categoria: "Alimentação", valor: 0 },
    { categoria: "Transporte", valor: 0 },
    { categoria: "Moradia", valor: 0 },
    { categoria: "Lazer", valor: 0 },
    { categoria: "Educação", valor: 0 },
    { categoria: "Saúde", valor: 0 },
    { categoria: "Outros", valor: 0 },
  ]);
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unLogged = onAuthStateChanged(auth, (userLogged) => {
      if (!userLogged) {
        router.push("/login");
      } else {
        setUser(userLogged);
      }
    });
  });

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "transactions", user?.uid, "items"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      let receita = 0;
      let despesa = 0;

      const categorias = [
        { categoria: "Alimentação", valor: 0 },
        { categoria: "Transporte", valor: 0 },
        { categoria: "Moradia", valor: 0 },
        { categoria: "Lazer", valor: 0 },
        { categoria: "Educação", valor: 0 },
        { categoria: "Saúde", valor: 0 },
        { categoria: "Outros", valor: 0 },
      ];

      snapshot.forEach((doc) => {
        const data = doc.data() as Transaction;

        if (data.type === "receita") {
          receita += data.value;
        } else if (data.type === "despesa") {
          despesa += data.value;

          // Atualiza a categoria correspondente
          const catIndex = categorias.findIndex(
            (c) => c.categoria === data.category
          );
          if (catIndex >= 0) {
            categorias[catIndex].valor += data.value;
          }
        }
      });

      total = receita - despesa;

      setBalance(total);
      setIncome(receita);
      setExpense(despesa);
      setDespesasCategoria(categorias);
    });
    const qry = query(
      collection(db, "bills", user.uid, "items"),
      orderBy("dueDate", "asc")
    );

    const bills = onSnapshot(qry, (snapshot) => {
      const docs: Bill[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Bill, "id">;
        docs.push({ id: doc.id, ...data });
      });
      setBills(docs);
    });

    return () => {
      (unsubscribe(), bills());
    };
  }, [user]);

  const [dolar, setDolar] = useState<string>("Carregando...");
  const [cripto, setCripto] = useState<cotacao>();
  const [btc, setBtc] = useState<number>();
  const [eth, setEth] = useState<number>();

  useEffect(() => {
    async function fetchDolar() {
      try {
        const valor = await getDolar();
        if (valor) {
          setDolar(`R$ ${parseFloat(valor).toFixed(2)}`);
        } else {
          setDolar("Cotação indisponível");
        }
      } catch (error) {
        console.error(error);
        setDolar("Erro ao buscar cotação");
      }
    }
    async function fetchCripto() {
      try {
        const valor = await getCripto();
        if (valor !== "Cotação não encontrada") {
          setCripto(valor);
        } else {
          console.log("Cotação não encontrada");
        }
      } catch (error) {
        console.error(error);
        console.log("Erro ao buscar cotação");
      }
    }

    fetchCripto();
    fetchDolar();
  }, []);

  useEffect(() => {
    setBtc(parseFloat(cripto?.BTCUSD.bid || "0"));
    setEth(parseFloat(cripto?.ETHUSD.bid || "0"));
  }, [cripto]);

  const isDueSoon = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3; // até 3 dias de antecedência
  };

  return (
    <>
      <div className="min-h-screen bg-[#FAFAF9] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Here&apos;s your productivity overview
              </p>
            </div>

            <div
              onClick={() => {
                setSelectedTask(null);
                setShowModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center gap-1 py-2 px-4 rounded-lg shadow-lg shadow-indigo-500/30"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </div>
          </div>
          {/* Balanço Geral */}
          <section className="grid gap-6 md:grid-cols-4 mb-8">
            <Card
              title="Total Tasks"
              variant="compact"
              value={100}
              subtitle="All time"
              icon={Target}
              gradient="from-indigo-400 to-indigo-600"
            />
            <Card
              title="In Progress"
              variant="compact"
              value={20}
              subtitle="Active now"
              icon={Clock}
              gradient="from-blue-400 to-blue-600"
            />
            <Card
              title="Completed"
              variant="compact"
              value={60}
              subtitle={`completion rate`}
              icon={CheckCircle2}
              gradient="from-green-400 to-green-600"
            />
            <Card
              title="Avg. Completion"
              variant="compact"
              value={20}
              subtitle="Days per task"
              icon={TrendingUp}
              gradient="from-purple-400 to-purple-600"
            />
          </section>
          {/* Gráficos */}|
          <section className="flex gap-6 mb-8">
            <Card variant="default" classname="mb-10 w-full">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Tarefas por Status
                </h2>
                <div>
                  <PizzaGraph data={despesasCategoria} />
                </div>
              </div>
            </Card>
            <Card variant="default" classname="mb-10 w-full">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Tarefas por Categoria
                </h2>
                <div>
                  <PizzaGraph data={despesasCategoria} />
                </div>
              </div>
            </Card>
          </section>
          {/*resumo task*/}
          <section className="flex gap-6">
            <Card variant="default" classname="mb-10 w-full">
              <span className="flex gap-2 text-xl font-bold items-center mb-6">
                <Clock className="text-indigo-600" />
                Tarefas Recentes
              </span>
              <TaskInfo
                titulo={"Teste"}
                descricao={"Esse é um teste"}
                prioridade={"Baixa"}
                categoria={"Pessoal"}
                data={"24 Nov"}
                responsavel={"Douglas"}
                estado={"Pendente"}
              />
            </Card>
            <Card variant="default" classname="mb-10 w-full">
              <span className="flex gap-2 text-xl font-bold items-center mb-6">
                <CircleAlertIcon className="text-orange-600" />
                Tarefas Urgentes
              </span>
              <TaskInfo
                titulo={"Urgente"}
                descricao={"Teste de tarefa urgente"}
                prioridade={"Alta"}
                categoria={"Urgente"}
                data={"24 Nov"}
                responsavel={"Equipe"}
                estado={"Pendente"}
              />
            </Card>
          </section>
        </div>
      </div>
      <TaskModal isOpen={showModal} onClose={(value) => setShowModal(value)} />
    </>
  );
}
