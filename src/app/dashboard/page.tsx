"use client";

import { Card } from "@/components/shared/card";
import { auth } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  CheckCircle2,
  CircleAlertIcon,
  Clock,
  Plus,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { TaskData, useAllTasks } from "@/lib/actions/taskService";
import TaskModal from "./components/TaskModal";
import { TaskInfo } from "./components/TaskInfo";
import { Card as TremorCard, Title } from "@tremor/react";
import { isPast, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import StatusChart from "./components/Charts/StatusChart";
import CategoryBarChart from "./components/Charts/CategoryChart";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  useEffect(() => {
    const unLogged = onAuthStateChanged(auth, (userLogged) => {
      if (!userLogged) router.push("/login");
      else setUser(userLogged);
    });

    return () => unLogged();
  }, [router]);

  const rawTasks = useAllTasks(user?.uid || null);

  const allTasks = useMemo(() => {
    return rawTasks ?? [];
  }, [rawTasks]);

  const pendingCount = allTasks.filter((t) => t.status === "Pendente").length;

  const overdueCount = allTasks.filter(
    (t) =>
      t.due_date && isPast(new Date(t.due_date)) && t.status !== "Finalizado"
  ).length;

  const completedThisWeek = allTasks.filter((t) => {
    if (!t.due_date || t.status !== "Finalizado") return false;

    const date = new Date(t.due_date);
    return isWithinInterval(date, {
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
    });
  }).length;

  const statusChartData = useMemo(() => {
    const pending = allTasks.filter((t) => t.status === "Pendente").length;
    const inProgress = allTasks.filter(
      (t) => t.status === "Em Andamento"
    ).length;
    const finished = allTasks.filter((t) => t.status === "Finalizado").length;

    return [
      { name: "Pendente", value: pending },
      { name: "Em Andamento", value: inProgress },
      { name: "Finalizado", value: finished },
    ];
  }, [allTasks]);

  const categoryChartData = useMemo(() => {
    const grouped: Record<string, number> = {};

    allTasks.forEach((task) => {
      const cat = task.category || "Sem categoria";
      grouped[cat] = (grouped[cat] || 0) + 1;
    });

    return Object.entries(grouped).map(([key, value]) => ({
      category: key,
      tasks: value,
    }));
  }, [allTasks]);

  return (
    <>
      <div className="p-10 bg-[#FAFAF9] min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Aqui está uma visão da sua produtividade!
            </p>
          </div>
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center gap-1 py-2 px-4 rounded-lg shadow-lg shadow-indigo-500/30 text-white hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Tarefa
            </div>
          </motion.div>
        </div>

        <section className="grid gap-6 lg:grid-cols-4 md:grid-cols-2 mb-8">
          <Card
            title="Tarefas Pendentes"
            variant="compact"
            value={pendingCount}
            subtitle="Aguardando ação"
            icon={Clock}
            gradient="from-yellow-400 to-yellow-600"
          />

          <Card
            title="Concluídas na Semana"
            variant="compact"
            value={completedThisWeek}
            subtitle="Últimos 7 dias"
            icon={CheckCircle2}
            gradient="from-green-400 to-green-600"
          />

          <Card
            title="Tarefas Vencidas"
            variant="compact"
            value={overdueCount}
            subtitle="Prazo excedido"
            icon={CircleAlertIcon}
            gradient="from-red-400 to-red-600"
          />

          <Card
            title="Total de Tarefas"
            variant="compact"
            value={allTasks.length}
            subtitle="Cadastradas"
            icon={Target}
            gradient="from-indigo-400 to-indigo-600"
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card variant="default" classname="w-full flex flex-col gap-3">
            <Title>Tarefas por Status</Title>
            <StatusChart data={statusChartData} />
          </Card>

          <Card variant="default" classname="w-full flex flex-col gap-3">
            <Title>Tarefas por Categoria</Title>
            <CategoryBarChart data={categoryChartData} />
          </Card>
        </section>

        <section className="flex gap-6 flex-col lg:flex-row">
          <Card variant="default" classname="w-full">
            <span className="flex gap-2 text-xl font-bold items-center mb-6">
              <Clock className="text-indigo-600" />
              Tarefas Recentes
            </span>

            <div className="flex flex-col gap-2">
              {allTasks?.map((task) => (
                <TaskInfo
                  key={task.id}
                  items={task}
                  setTask={setSelectedTask}
                  setModal={setShowModal}
                />
              ))}
            </div>
          </Card>

          <Card variant="default" classname="w-full">
            <span className="flex gap-2 text-xl font-bold items-center mb-6">
              <CircleAlertIcon className="text-orange-600" />
              Tarefas Urgentes
            </span>

            <div className="flex flex-col gap-2">
              {allTasks
                .filter((t) => t.category === "Urgente")
                .map((task) => (
                  <TaskInfo
                    key={task.id}
                    items={task}
                    setTask={setSelectedTask}
                    setModal={setShowModal}
                  />
                ))}
            </div>
          </Card>
        </section>
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask || undefined}
      />
    </>
  );
}
