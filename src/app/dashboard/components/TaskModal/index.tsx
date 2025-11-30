"use client";

import React, { useEffect, useState } from "react";
import {
  Save,
  X,
  Plus,
  Trash2,
  Delete,
  DeleteIcon,
  CircleX,
} from "lucide-react";
import {
  createTask,
  deleteTask,
  SubTask,
  TaskData,
  updateTask,
} from "@/lib/actions/taskService";
import { auth } from "@/lib/firebase/firebaseconfig";

type TaskModalProps = {
  isOpen?: boolean;
  onClose: (modal: boolean) => void;
  task?: TaskData;
};

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const user = auth.currentUser;

  const [formData, setFormData] = useState<Omit<TaskData, "id">>({
    title: "",
    description: "",
    due_date: "",
    priority: "Baixa",
    status: "Pendente",
    category: "",
    subtasks: [],
    progress: 0,
  });

  const [subtaskTitle, setSubtaskTitle] = useState("");

  // calcula progresso automaticamente
  const recalcProgress = (subtasks: SubTask[]) => {
    if (!subtasks.length) return 0;
    const doneCount = subtasks.filter((s) => s.done).length;
    return Math.round((doneCount / subtasks.length) * 100);
  };

  // carrega dados da tarefa ao editar
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        due_date: task.due_date || "",
        priority: task.priority || "Baixa",
        status: task.status || "Pendente",
        category: task.category || "",
        assignee: task.assignee || "",
        subtasks: task.subtasks || [],
        progress:
          typeof task.progress === "number"
            ? task.progress
            : recalcProgress(task.subtasks || []),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        due_date: "",
        priority: "Baixa",
        status: "Pendente",
        category: "",
        assignee: "",
        subtasks: [],
        progress: 0,
      });
    }
  }, [task, isOpen]);

  const addSubtask = () => {
    const text = subtaskTitle.trim();
    if (!text) return;

    const newSubtask: SubTask = {
      id: crypto.randomUUID(),
      title: text,
      done: false,
    };

    const updated = [...formData.subtasks, newSubtask];
    setFormData({
      ...formData,
      subtasks: updated,
      progress: recalcProgress(updated),
    });
    setSubtaskTitle("");
  };

  const removeSubtask = (id: string) => {
    const updated = formData.subtasks.filter((s) => s.id !== id);
    setFormData({
      ...formData,
      subtasks: updated,
      progress: recalcProgress(updated),
    });
  };

  const toggleSubtask = (id: string) => {
    const updated = formData.subtasks.map((s) =>
      s.id === id ? { ...s, done: !s.done } : s
    );
    setFormData({
      ...formData,
      subtasks: updated,
      progress: recalcProgress(updated),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const progress = recalcProgress(formData.subtasks);

    try {
      if (task && task.id) {
        await updateTask(user.uid, task.id, { ...formData, progress });
      } else {
        // 🔥 impede ID undefined de ir para o Firebase
        const { ...payloadNoId } = formData;
        await createTask(user.uid, { ...payloadNoId, progress });
      }

      onClose(false);
    } catch (err) {
      console.error("Erro ao salvar tarefa:", err);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    console.log("teste");
    try {
      if (task && task.id) {
        await deleteTask(user.uid, task.id);
      }
      onClose(false);
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black/70 z-50 fixed inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90%] bg-[#FAFAF9] p-6 rounded-lg shadow-lg text-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {task ? "Editar tarefa" : "Criar nova tarefa"}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-slate-600 hover:text-slate-900"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2 max-h-[400px] overflow-x-hidden">
            {/* Inputs principais */}
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                value={formData.title}
                placeholder="Digite aqui..."
                required
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border border-slate-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                placeholder="Digite aqui..."
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border border-slate-300 rounded h-24 resize-none px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prioridade
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as TaskData["priority"],
                    })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2"
                >
                  <option value="">Selecione</option>
                  <option value="Pessoal">Pessoal</option>
                  <option value="Equipe">Equipe</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prazo</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={formData.assignee}
                  placeholder="Digite aqui..."
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, assignee: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Subtarefas */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Subtarefas
              </label>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Adicionar subtarefa..."
                  value={subtaskTitle}
                  onChange={(e) => setSubtaskTitle(e.target.value)}
                  className="flex-1 border border-slate-300 rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded hover:shadow-md"
                >
                  <Plus />
                </button>
              </div>

              <ul className="space-y-2">
                {formData.subtasks.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 border border-slate-200 rounded px-3 py-2"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={s.done}
                        onChange={() => toggleSubtask(s.id)}
                      />
                      <span
                        className={s.done ? "line-through text-gray-500" : ""}
                      >
                        {s.title}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeSubtask(s.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-sm text-gray-600 mt-2">
            Progresso: {formData.progress || 0}%
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="w-full flex gap-2 items-center justify-center border rounded px-4 py-2 hover:cursor-pointer hover:shadow-md"
            >
              <X className="inline" />
              Cancelar
            </button>

            {task && (
              <button
                type="submit"
                className="w-full flex gap-2 items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 hover:cursor-pointer hover:shadow-md"
                onClick={handleDelete}
              >
                <CircleX className="inline" />
                Deletar Tarefa
              </button>
            )}

            <button
              type="submit"
              className="w-full flex gap-2 items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 hover:cursor-pointer hover:shadow-md"
              onClick={() => handleSubmit}
            >
              <Save className="inline" />
              {task ? "Atualizar" : "Criar"} Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
