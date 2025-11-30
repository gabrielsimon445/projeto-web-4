"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskData } from "@/lib/actions/taskService";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

type SortableItemProps = {
  id: string; // sempre string
  task: TaskData; // tipagem correta
  column: string;
  onClick?: () => void; // opcional
};

export function SortableItem({ id, task, column, onClick }: SortableItemProps) {
  const [stateColor, setStateColor] = useState<string>("");
  const [badgeColor, setBadgeColor] = useState<string>("");
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        task,
        column,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    switch (task?.status) {
      case "Pendente":
        setStateColor("indigo-300");
        break;
      case "Em Andamento":
        setStateColor("yellow-300");
        break;
      case "Finalizado":
        setStateColor("green-300");
        break;
      default:
        setStateColor("slate-300");
    }
  }, [task?.status]);

  useEffect(() => {
    switch (task?.priority) {
      case "Baixa":
        setBadgeColor("bg-green-100 border-green-500 text-green-700");
        break;
      case "Média":
        setBadgeColor("bg-yellow-100 border-yellow-500 text-yellow-700");
        break;
      case "Alta":
        setBadgeColor("border-red-500 text-red-700 bg-red-100");
        break;
      default:
        setBadgeColor("border-slate-300 text-slate-700 bg-slate-100");
    }
  }, [task?.priority]);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onDoubleClick={onClick}
      className={`bg-white/70 text-slate-700 font-light shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow border-l-4 border-${stateColor} space-y-2`}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
        <div
          className={`px-3 border rounded-lg shadow-sm text-sm ${badgeColor}`}
        >
          {task?.priority || "—"}
        </div>
      </div>
      <p className="text-sm text-gray-500 truncate">{task.description}</p>
      <div className="flex justify-between">
        <span className="text-[12px]">
          Subtarefas: {task?.subtasks?.length ?? 0} • Progresso:{" "}
          {task?.progress ?? 0}%
        </span>
        {"responsible" in (task as any) || "assignee" in (task as any) ? (
          <span className="flex items-center text-[12px] gap-1">
            <User size={13} />
            {(task as any).responsible ?? (task as any).assignee ?? "—"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
