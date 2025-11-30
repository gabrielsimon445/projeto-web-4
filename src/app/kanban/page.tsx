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
import { Card } from "@/components/shared/card";
import { motion } from "framer-motion";

type ColumnKey = "Pendente" | "Em Andamento" | "Finalizado";

const emptyColumns: Record<ColumnKey, TaskData[]> = {
  Pendente: [],
  "Em Andamento": [],
  Finalizado: [],
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
      Pendente: pending ?? prev.Pendente,
      "Em Andamento": progress ?? prev["Em Andamento"],
      Finalizado: done ?? prev.Finalizado,
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
  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  return (
    <div className="p-10 bg-[#FAFAF9] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban</h1>
        </div>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div
            onClick={() => handleCreateTask()}
            className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center gap-1 py-2 px-4 rounded-lg shadow-lg shadow-indigo-500/30 text-white hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Tarefa
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-6 bg-[#FAFAF9] min-h-full">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          {(Object.keys(columns) as ColumnKey[]).map((key) => {
            const items = columns[key] ?? [];

            return (
              <Card key={key} variant="default">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-lg capitalize">{key}</h2>
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
              </Card>
            );
          })}
        </DndContext>

        {/* MODAL */}
        <TaskModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          task={selectedTask?.id ? selectedTask : undefined}
        />
      </div>
    </div>
  );
}
