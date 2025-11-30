"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  usePendingTasks,
  useProgressTasks,
  useDoneTasks,
  updateTaskStatus,
} from "@/lib/actions/taskService";
import TaskModal from "../dashboard/components/TaskModal";
import { auth } from "@/lib/firebase/firebaseconfig";
import { SortableItem } from "./sortable-item";
import { Plus } from "lucide-react";
import type { TaskData } from "@/lib/actions/taskService";
import { DroppableColumn } from "./DroppableColumn";

type ColumnKey = "pendente" | "em andamento" | "finalizado";

const emptyColumns: Record<ColumnKey, TaskData[]> = {
  pendente: [],
  "em andamento": [],
  finalizado: [],
};

export default function Kanban() {
  const user = auth.currentUser;

  // Firebase collections
  const pending = usePendingTasks(user?.uid || null) as TaskData[] | null;
  const progress = useProgressTasks(user?.uid || null) as TaskData[] | null;
  const done = useDoneTasks(user?.uid || null) as TaskData[] | null;

  // local board state
  const [columns, setColumns] =
    useState<Record<ColumnKey, TaskData[]>>(emptyColumns);

  // for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [createColumn, setCreateColumn] = useState<ColumnKey | null>(null);

  useEffect(() => {
    setColumns((prev) => ({
      pendente: pending ?? prev.pendente,
      "em andamento": progress ?? prev["em andamento"],
      finalizado: done ?? prev.finalizado,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending?.length, progress?.length, done?.length]);

  // ============================
  //  🔹 HANDLE DRAG START
  // ============================
  const handleDragStart = (event: DragStartEvent) => {
    // Apenas para animações ou manipulação futura
    document.body.style.cursor = "grabbing";
  };

  // ============================
  //  🔹 HANDLE DRAG OVER (ANIMAÇÃO SUAVE ENTRE LISTAS)
  // ============================
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  };

  // ============================
  //  🔹 HANDLE DRAG END + ROLLBACK
  // ============================
  const handleDragEnd = async (event: any) => {
    document.body.style.cursor = "default";

    const { active, over } = event;
    if (!active || !over) return;

    const activeData = active.data?.current;
    const overData = over.data?.current;

    if (!activeData || !overData) return;

    const fromColumn = activeData.column as ColumnKey;
    const toColumn = overData.column as ColumnKey;

    if (fromColumn === toColumn) return;

    const task: TaskData = activeData.task;

    // backup para rollback
    const previousState = structuredClone(columns);

    try {
      // Remove da origem
      const updatedSource = columns[fromColumn].filter((t) => t.id !== task.id);

      // Adiciona no destino
      const updatedDestination = [
        ...columns[toColumn],
        { ...task, status: toColumn },
      ];

      // Atualiza local
      setColumns((prev) => ({
        ...prev,
        [fromColumn]: updatedSource,
        [toColumn]: updatedDestination,
      }));

      // Atualiza no firebase
      if (task.id) {
        await updateTaskStatus(user?.uid ?? "", task.id, toColumn);
      }
    } catch (err) {
      console.error("Erro ao mover tarefa:", err);

      // ROLLBACK
      setColumns(previousState);
    }
  };

  // ============================
  //  🔹 HANDLE CREATE TASK
  // ============================
  const handleCreateTask = (column: ColumnKey) => {
    setSelectedTask(null);
    setCreateColumn(column);
    setShowModal(true);
  };

  return (
    <div className="p-10 grid grid-cols-3 gap-6 bg-[#FAFAF9] min-h-screen">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        {(Object.keys(columns) as ColumnKey[]).map((key) => {
          const items = columns[key] ?? [];

          return (
            <div key={key} className="bg-white rounded-xl border p-4 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-lg capitalize">{key}</h2>

                {/* + Criar tarefa na coluna */}
                <button
                  onClick={() => handleCreateTask(key)}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
              <DroppableColumn id={key}>
                <SortableContext
                  items={items.map((t, i) => t.id ?? `temp-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((task, index) => (
                    <SortableItem
                      key={task.id ?? `temp-${index}`}
                      id={task.id ?? `temp-${index}`}
                      task={task}
                      column={key}
                      onClick={() => {
                        setSelectedTask(task);
                        setShowModal(true);
                      }}
                    />
                  ))}
                </SortableContext>
              </DroppableColumn>
            </div>
          );
        })}
      </DndContext>

      {/* MODAL */}
      <TaskModal
        isOpen={showModal}
        onClose={(v) => setShowModal(v)}
        task={selectedTask?.id ? selectedTask : undefined}
      />
    </div>
  );
}
