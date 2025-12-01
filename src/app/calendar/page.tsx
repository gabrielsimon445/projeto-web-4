"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TaskModal from "../dashboard/components/TaskModal";
import { CalendarCheck, Plus } from "lucide-react";
import { auth } from "@/lib/firebase/firebaseconfig";
import ptBr from "@fullcalendar/core/locales/pt-br";

// 🔥 Importando TaskService
import {
  useAllTasks,
  createTask,
  updateTask,
  TaskData,
} from "@/lib/actions/taskService";
import { motion } from "framer-motion";

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
        priority: t.priority,
        date: t.due_date,
      })) || [];

  return (
    <div className="min-h-screen bg-[#FAFAF9] p-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendário</h1>
          <p className="text-gray-600">Visualize suas tarefas por data</p>
        </div>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div
            onClick={() => {
              (setSelectedTask(null), setShowModal(true));
            }}
            className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center gap-1 py-2 px-4 rounded-lg shadow-lg shadow-indigo-500/30 text-white hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Tarefa
          </div>
        </motion.div>
      </div>

      {/* CALENDÁRIO */}
      <div className="bg-white p-4 rounded-xl shadow-xl">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptBr}
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={(info) => {
            const task = allTasks?.find((t) => t.id === info.event.id);
            setSelectedTask(task || null);
            setShowModal(true);
          }}
          eventContent={(arg) => (
            <div className="flex items-center gap-1 px-1 py-0.5">
              <CalendarCheck className="w-3 h-3" />
              <span className="text-xs font-medium">{arg.event.title}</span>
            </div>
          )}
          dayMaxEvents={true} // mostra "+X" quando tiver muitos eventos
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
      <style jsx global>{`
        .fc .fc-button {
          background-color: #4f39f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.25rem 0.75rem;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }

        .fc .fc-button:hover {
          background-color: #4338ca;
        }

        .fc .fc-button.fc-button-active {
          background-color: #4f39f6;
        }

        .fc-toolbar-title {
          font-weight: 700;
          font-size: 1.25rem;
          color: #111827; /* text-gray-900 */
        }
      `}</style>
    </div>
  );
}
