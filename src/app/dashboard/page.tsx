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
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TaskInfo } from "./components/TaskInfo";
import TaskModal from "./components/TaskModal";
import { useAllTasks, useUrgentsTasks } from "@/lib/actions/taskService";

export default function DashboardPage() {
  const router = useRouter();
  const [selectTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unLogged = onAuthStateChanged(auth, (userLogged) => {
      if (!userLogged) {
        router.push("/login");
      } else {
        setUser(userLogged);
      }
    });
  }, [router]);

  const Alltasks = useAllTasks(user?.uid || null);
  const urgentTasks = useUrgentsTasks(user?.uid || null);

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
                <div>{/* <PizzaGraph data={despesasCategoria} /> */}</div>
              </div>
            </Card>
            <Card variant="default" classname="mb-10 w-full">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Tarefas por Categoria
                </h2>
                <div>{/* <PizzaGraph data={despesasCategoria} /> */}</div>
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
              <div className="flex flex-col gap-2">
                {Alltasks?.map((task, id) => (
                  <TaskInfo
                    key={id}
                    titulo={task.title}
                    descricao={task.description}
                    prioridade={task.priority}
                    categoria={task.category}
                    data={task.dueDate}
                    responsavel={task.assignee}
                    estado={task.status}
                  />
                ))}
              </div>
            </Card>
            <Card variant="default" classname="mb-10 w-full">
              <span className="flex gap-2 text-xl font-bold items-center mb-6">
                <CircleAlertIcon className="text-orange-600" />
                Tarefas Urgentes
              </span>
              <div className="flex flex-col gap-2">
                {urgentTasks?.map((task, id) => (
                  <TaskInfo
                    key={id}
                    titulo={task.title}
                    descricao={task.description}
                    prioridade={task.priority}
                    categoria={task.category}
                    data={task.dueDate}
                    responsavel={task.assignee}
                    estado={task.status}
                  />
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
      <TaskModal isOpen={showModal} onClose={(value) => setShowModal(value)} />
    </>
  );
}
