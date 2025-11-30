"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import TaskModal from "../dashboard/components/TaskModal";
import { Plus } from "lucide-react";
import { auth } from "@/lib/firebase/firebaseconfig";

// 🔥 Importando TaskService
import {
  useAllTasks,
  createTask,
  updateTask,
  TaskData,
} from "@/lib/actions/taskService";

export default function CalendarPage() {
  const user = auth.currentUser;
  const userId = user?.uid || null;

  const allTasks = useAllTasks(userId);

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  // ==============================
  // Salvar Task (create/update)
  // ==============================
  const handleSaveTask = async (taskData: TaskData) => {
    if (!userId) return;

    if (selectedTask) {
      await updateTask(userId, selectedTask.id!, taskData);
    } else {
      await createTask(userId, taskData);
    }

    setSelectedTask(null);
  };

  // ==============================
  // Converter tasks → Eventos
  // ==============================
  const events =
    allTasks
      ?.filter((t) => t.due_date)
      .map((t) => ({
        id: t.id,
        title: t.title,
        date: t.due_date,
      })) || [];

  return (
    <div className="min-h-screen bg-[#FAFAF9] p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
            <p className="text-gray-600">Visualize suas tarefas por data</p>
          </div>

          <button
            onClick={() => {
              setSelectedTask(null);
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
          >
            <Plus size={18} />
            Nova Task
          </button>
        </div>

        {/* CALENDÁRIO */}
        <div className="bg-white p-4 rounded-xl shadow-lg border">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={(info) => {
              const task = allTasks?.find((t) => t.id === info.event.id);
              setSelectedTask(task || null);
              setShowModal(true);
            }}
            height="auto"
          />
        </div>

        {/* MODAL */}
        <TaskModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask || undefined}
        />
      </div>
    </div>
  );
}
