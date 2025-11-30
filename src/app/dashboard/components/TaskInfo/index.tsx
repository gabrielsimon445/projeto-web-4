import { Card } from "@/components/shared/card";
import { Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { FormData } from "../TaskModal";

type TaskInfoProps = {
  items: FormData;
};

export function TaskInfo({ items }: TaskInfoProps) {
  const [dot, setDot] = useState("");
  const [badgeColor, setBadgeColor] = useState("");
  const [estadoColor, setEstadoColor] = useState("");

  useEffect(() => {
    switch (items.priority) {
      case "Alta": {
        setDot("bg-red-500");
        break;
      }
      case "Média": {
        setDot("bg-yellow-500");
        break;
      }
      case "Baixa": {
        setDot("bg-green-500");
        break;
      }
      default: {
        setDot("bg-slate-500");
        break;
      }
    }

    switch (items.category) {
      case "Pessoal": {
        setBadgeColor("bg-blue-100 border-blue-300 text-blue-800");
        break;
      }
      case "Equipe": {
        setBadgeColor("bg-purple-100 border-purple-300 text-purple-800");
        break;
      }
      case "Urgente": {
        setBadgeColor("bg-red-100 border-red-300 text-red-800");
        break;
      }
      default: {
        setBadgeColor("bg-slate-100 border-slate-300 text-slate-800");
        break;
      }
    }

    switch (items.status) {
      case "Pendente": {
        setEstadoColor("bg-slate-100 border-slate-300 text-slate-800");
        break;
      }
      case "Em Andamento": {
        setEstadoColor("bg-indigo-100 border-indigo-300 text-indigo-800");
        break;
      }
      case "Finalizado": {
        setEstadoColor("bg-green-100 border-green-300 text-green-800");
        break;
      }
      default: {
        setEstadoColor("bg-slate-100 border-slate-300 text-slate-800");
        break;
      }
    }
  }, [items.category, items.priority, items.status]);

  return (
    <Card
      variant="default"
      classname={`w-full !bg-slate-100 border border-slate-300 !p-4`}
    >
      <div className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${dot}`} />
            <h1 className="font-semibold">{items.title}</h1>
          </div>
          <div
            className={`px-3 border rounded-lg shadow-md text-sm ${badgeColor}`}
          >
            {items.category}
          </div>
        </header>
        <span className="text-[14px] block truncate w-[95%]">{items.description}</span>
        <footer className="flex items-center justify-between">
          <div className="flex gap-3">
            <span className="flex items-center text-[12px]">
              <Calendar height={13} />
              {items.due_date}
            </span>
            <span className="flex items-center text-[12px]">
              <User height={13} />
              {items.assignee}
            </span>
          </div>
          <div className={`px-3 border rounded-lg text-sm ${estadoColor}`}>
            <span>{items.status}</span>
          </div>
        </footer>
      </div>
    </Card>
  );
}
