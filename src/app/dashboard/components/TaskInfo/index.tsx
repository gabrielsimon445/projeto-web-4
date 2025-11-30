import { TaskData } from "@/lib/actions/taskService";
import { motion } from "framer-motion";
import { Calendar, User, AlarmClock } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";

type TaskInfoProps = {
  items: TaskData;
  setTask: (value: SetStateAction<TaskData | null>) => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function TaskInfo({ items, setTask, setModal }: TaskInfoProps) {
  const [dot, setDot] = useState("");
  const [badgeColor, setBadgeColor] = useState("");
  const [estadoColor, setEstadoColor] = useState("");
  const [deadlineColor, setDeadlineColor] = useState("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  // 📅 Cálculo automático da urgência (usa due_date)
  useEffect(() => {
    if (!items?.due_date) {
      setDaysLeft(null);
      setDeadlineColor("border-slate-300 text-slate-700 bg-slate-100");
      return;
    }

    const today = new Date();
    const dueDate = new Date(items.due_date);
    // zerar horas para comparação por dias
    const diffMs = dueDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const diff = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    setDaysLeft(diff);

    if (diff <= 0) {
      // vence hoje (0) ou já venceu (negativo)
      setDeadlineColor("border-red-500 text-red-700 bg-red-100");
    } else if (diff <= 2) {
      setDeadlineColor("border-red-500 text-red-700 bg-red-100");
    } else if (diff <= 5) {
      setDeadlineColor("border-yellow-500 text-yellow-700 bg-yellow-100");
    } else {
      setDeadlineColor("border-slate-300 text-slate-700 bg-slate-100");
    }
  }, [items?.due_date]);

  // 🎨 Prioridade (usa valores: "alta" | "media" | "baixa")
  useEffect(() => {
    switch (items?.priority) {
      case "Alta":
        setDot("red-500");
        break;
      case "Media":
        setDot("yellow-500");
        break;
      case "Baixa":
        setDot("green-500");
        break;
      default:
        setDot("slate-500");
    }
  }, [items?.priority]);

  // 🔖 Categoria (valores esperados: "pessoal" | "equipe" | "urgente")
  useEffect(() => {
    switch (items?.category) {
      case "Pessoal":
        setBadgeColor("bg-blue-100 border-blue-500 text-blue-700");
        break;
      case "Equipe":
        setBadgeColor("bg-purple-100 border-purple-500 text-purple-700");
        break;
      case "Urgente":
        setBadgeColor("border-red-500 text-red-700 bg-red-100");
        break;
      default:
        setBadgeColor("border-slate-300 text-slate-700 bg-slate-100");
    }
  }, [items?.category]);

  // 🔄 Status (valores: "pendente" | "em andamento" | "finalizado")
  useEffect(() => {
    switch (items?.status) {
      case "Pendente":
        setEstadoColor("border-slate-300 text-slate-700 bg-slate-100");
        break;
      case "Em Andamento":
        setEstadoColor("border-yellow-300 text-yellow-700 bg-yellow-100");
        break;
      case "Finalizado":
        setEstadoColor("bg-green-100 border-green-300 text-green-800");
        break;
      default:
        setEstadoColor("border-slate-300 text-slate-700 bg-slate-100");
    }
  }, [items?.status]);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`bg-white/70 text-slate-700 font-light shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow border-l-4 border-${dot}`}
        onClick={() => {
          setTask(items);
          setModal(true);
        }}
      >
        <div className="flex flex-col gap-3">
          {/* Título e categoria */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-${dot}`} />
              <h1 className="font-semibold truncate max-w-[220px]">
                {items?.title}
              </h1>
            </div>
            <div
              className={`px-3 border rounded-lg shadow-sm text-sm ${badgeColor}`}
            >
              {items?.category || "—"}
            </div>
          </header>

          {/* Descrição */}
          <span className="text-sm text-gray-700 block truncate w-[95%]">
            {items?.description || "Sem descrição"}
          </span>

          {/* Urgência visual */}
          <section className="flex gap-2 items-center">
            <span className="text-[12px]">
              Subtarefas: {items?.subtasks?.length ?? 0} • Progresso:{" "}
              {items?.progress ?? 0}%
            </span>
            <div className={`px-3 border rounded-lg text-sm ${estadoColor}`}>
              <span>{items?.status ?? "—"}</span>
            </div>
          </section>

          {/* Rodapé */}
          <footer className="flex items-center justify-between">
            <div className="flex gap-4 text-gray-600 items-center">
              <span className="flex items-center text-[12px] gap-1">
                <Calendar size={13} />
                {items?.due_date ?? "—"}
              </span>
              <div
                className={`px-3 py-1 text-xs rounded-md border flex items-center gap-2 ${deadlineColor}`}
              >
                <AlarmClock size={14} />
                {daysLeft === null ? (
                  <span>Data não informada</span>
                ) : daysLeft < 0 ? (
                  <span>
                    Vencida há {Math.abs(daysLeft)} dia
                    {Math.abs(daysLeft) > 1 ? "s" : ""}
                  </span>
                ) : daysLeft === 0 ? (
                  <span>Vence hoje</span>
                ) : (
                  <span>
                    Faltam {daysLeft} dia{daysLeft > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Se existir responsável dentro do seu objeto, mostre; senão ignore */}
              {"responsible" in (items as any) ||
              "assignee" in (items as any) ? (
                <span className="flex items-center text-[12px] gap-1">
                  <User size={13} />
                  {(items as any).responsible ?? (items as any).assignee ?? "—"}
                </span>
              ) : null}
            </div>
          </footer>
        </div>
      </div>
    </motion.div>
  );
}
