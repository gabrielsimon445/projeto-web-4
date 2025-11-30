"use client";

import { auth } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TaskInfo } from "../dashboard/components/TaskInfo";
import TaskModal from "../dashboard/components/TaskModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDoneTasks, usePendingTasks, useProgressTasks } from "@/lib/actions/taskService";

interface TaskData {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  categoria: string;
  data: string;
  responsavel: string;
  estado: string;
}

export default function KanbanPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(auth.currentUser);

  // 🔥 TASKS LOCAIS DO KANBAN
  const [columns, setColumns] = useState<
    Record<string, { name: string; color: string; items: FormData[] }>
  >({
    pendente: {
      name: "Pendente",
      color: "bg-gradient-to-r from-green-400 to-green-600",
      items: usePendingTasks(user?.uid || null) as FormData[],
    },
    andamento: {
      name: "Em Andamento",
      color: "bg-gradient-to-r from-indigo-400 to-indigo-600",
      items: useProgressTasks(user?.uid || null) as FormData[],
    },
    finalizado: {
      name: "Finalizado",
      color: "bg-gradient-to-r from-green-400 to-green-600",
      items: useDoneTasks(user?.uid || null) as FormData[],
    },
  });

  // 🔥 FUNÇÃO PRINCIPAL DO DRAG & DROP
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Mesma coluna
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];

      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });

      return;
    }

    // Colunas diferentes
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [removed] = sourceItems.splice(source.index, 1);
    removed.status = destColumn.name; // Atualiza o estado visualmente

    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      [destination.droppableId]: { ...destColumn, items: destItems },
    });
  };

  // ==========================================================
  // (RESTO DO SEU CÓDIGO ORIGINAL — sem alterações)
  // ==========================================================

  const [selectTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unLogged = onAuthStateChanged(auth, (userLogged) => {
      if (!userLogged) {
        router.push("/login");
      } else {
        setUser(userLogged);
      }
    });
  });

  console.log("Colunas do Kanban:", columns);

  return (
    <>
      <div className="min-h-screen bg-[#FAFAF9] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban</h1>
              <p className="text-gray-600">Organize and track your workflow</p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 border rounded-lg shadow-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full h-full text-gray-400 rounded-lg text-sm"
                />
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
          </div>

          {/* 🟦 GRID DO KANBAN COM DRAG & DROP */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid md:grid-cols-3 gap-6 min-h-[500px]">
              {Object.entries(columns).map(([columnId, column]) => (
                <div key={columnId} className="flex flex-col gap-4">
                  <div className="flex gap-3 items-center">
                    <div
                      className={`px-3 py-1 text-sm rounded-lg ${column.color} text-white`}
                    >
                      {column.items.length}
                    </div>
                    <h1 className="text-black font-semibold text-xl">
                      {column.name}
                    </h1>
                  </div>

                  <Droppable droppableId={columnId}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-slate-400/10 rounded-xl w-full min-h-[300px] p-4 flex flex-col gap-4"
                      >
                        {column.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskInfo {...item} />
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      <TaskModal isOpen={showModal} onClose={(value) => setShowModal(value)} />
    </>
  );
}
