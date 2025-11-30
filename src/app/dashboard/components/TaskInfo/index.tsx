import { Card } from "@/components/shared/card";
import { TaskData } from "@/lib/actions/taskService";
import { Calendar, User, AlarmClock } from "lucide-react";
import { useEffect, useState } from "react";

type TaskInfoProps = {
  items: TaskData;
};

export function TaskInfo({ items }: TaskInfoProps) {
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
    const diffMs = dueDate.setHours(0,0,0,0) - today.setHours(0,0,0,0);
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
      case "alta":
        setDot("bg-red-500");
        break;
      case "media":
        setDot("bg-yellow-500");
        break;
      case "baixa":
        setDot("bg-green-500");
        break;
      default:
        setDot("bg-slate-500");
    }
  }, [items?.priority]);

  // 🔖 Categoria (valores esperados: "pessoal" | "equipe" | "urgente")
  useEffect(() => {
    switch (items?.category) {
      case "pessoal":
        setBadgeColor("bg-blue-100 border-blue-300 text-blue-800");
        break;
      case "equipe":
        setBadgeColor("bg-purple-100 border-purple-300 text-purple-800");
        break;
      case "urgente":
        setBadgeColor("bg-red-100 border-red-300 text-red-800");
        break;
      default:
        setBadgeColor("bg-slate-100 border-slate-300 text-slate-800");
    }
  }, [items?.category]);

  // 🔄 Status (valores: "pendente" | "em andamento" | "finalizado")
  useEffect(() => {
    switch (items?.status) {
      case "pendente":
        setEstadoColor("bg-slate-100 border-slate-300 text-slate-800");
        break;
      case "em andamento":
        setEstadoColor("bg-indigo-100 border-indigo-300 text-indigo-800");
        break;
      case "finalizado":
        setEstadoColor("bg-green-100 border-green-300 text-green-800");
        break;
      default:
        setEstadoColor("bg-slate-100 border-slate-300 text-slate-800");
    }
  }, [items?.status]);

  return (
    <Card
      variant="default"
      classname="w-full bg-white border border-slate-300 p-4 rounded-xl shadow-sm hover:shadow-md transition"
    >
      <div className="flex flex-col gap-3">
        {/* Título e categoria */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${dot}`} />
            <h1 className="font-semibold truncate max-w-[220px]">
              {items?.title}
            </h1>
          </div>

          <div className={`px-3 border rounded-lg shadow-sm text-sm ${badgeColor}`}>
            {items?.category || "—"}
          </div>
        </header>

        {/* Descrição */}
        <span className="text-sm text-gray-700 block truncate w-[95%]">
          {items?.description || "Sem descrição"}
        </span>

        {/* Urgência visual */}
        <div className={`px-3 py-1 text-xs rounded-md border flex items-center gap-2 ${deadlineColor}`}>
          <AlarmClock size={14} />
          {daysLeft === null ? (
            <span>Data não informada</span>
          ) : daysLeft < 0 ? (
            <span>Vencida há {Math.abs(daysLeft)} dia{Math.abs(daysLeft) > 1 ? "s" : ""}</span>
          ) : daysLeft === 0 ? (
            <span>Vence hoje</span>
          ) : (
            <span>Faltam {daysLeft} dia{daysLeft > 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Rodapé */}
        <footer className="flex items-center justify-between">
          <div className="flex gap-4 text-gray-600 items-center">
            <span className="flex items-center text-[12px] gap-1">
              <Calendar size={13} />
              {items?.due_date ?? "—"}
            </span>

            {/* Se existir responsável dentro do seu objeto, mostre; senão ignore */}
            {"responsible" in (items as any) || "assignee" in (items as any) ? (
              <span className="flex items-center text-[12px] gap-1">
                <User size={13} />
                {(items as any).responsible ?? (items as any).assignee ?? "—"}
              </span>
            ) : null}

            <span className="text-[12px]">
              Subtarefas: {items?.subtasks?.length ?? 0} • Progresso: {items?.progress ?? 0}%
            </span>
          </div>

          <div className={`px-3 border rounded-lg text-sm ${estadoColor}`}>
            <span>{items?.status ?? "—"}</span>
          </div>
        </footer>
      </div>
    </Card>
  );
}
