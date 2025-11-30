"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskData } from "@/lib/actions/taskService";

type SortableItemProps = {
  id: string;        // sempre string
  task: TaskData;    // tipagem correta
  column: string;
  onClick?: () => void; // opcional
};

export function SortableItem({ id, task, column, onClick }: SortableItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={onClick}
      className="bg-white border rounded-xl p-4 shadow-sm cursor-grab active:cursor-grabbing mb-3"
    >
      <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
      <p className="text-sm text-gray-500 truncate">{task.description}</p>
    </div>
  );
}
