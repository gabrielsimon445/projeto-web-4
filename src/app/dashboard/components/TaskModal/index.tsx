import React, { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { createTask } from "@/lib/actions/taskService";
import { auth } from "@/lib/firebase/firebaseconfig";

type TaskModalProps = {
  isOpen?: boolean;
  onClose: (modal: boolean) => void;
  task?: FormData;
};

export interface FormData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  due_date: string;
  assignee: string;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const user = auth.currentUser;
  const [formData, setFormData] = useState<FormData>({
    id: "",
    title: "",
    description: "",
    status: "pendente",
    priority: "",
    category: "",
    due_date: "",
    assignee: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    if (task && (task as any).id) {
      // await updateTask(user?.uid, (task as any).id, formData);
    } else {
      await createTask(user?.uid, formData);
    }

    onClose(false);
  };

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  return (
    <>
      {isOpen && (
        <div className="bg-slate-900/50 z-50 fixed inset-0 flex overflow-hidden">
          <div className="w-1/3 bg-[#FAFAF9] m-auto p-8 rounded-lg text-slate-800">
            <div>
              <span className="text-2xl font-bold">
                {task ? "Editar tarefa" : "Criar nova tarefa"}
              </span>
            </div>

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-5 mt-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="title">Título da Tarefa *</label>
                <input
                  id="title"
                  placeholder="Insira título da tarefa"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="border border-slate-300 px-3 py-1 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  placeholder="Adicionar detalhes da tarefa..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-24 resize-none border border-slate-300 p-3 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="priority">Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="border border-slate-300 px-2 py-1 rounded-lg"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="category">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="border border-slate-300 px-2 py-1 rounded-lg"
                  >
                    <option value="pessoal">Pessoal</option>
                    <option value="equipe">Equipe</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label>Prazo</label>
                  <div>
                    <div>
                      <label className="border border-slate-300 rounded-lg flex items-center gap-3 w-full px-3 py-1 cursor-pointer">
                        <input
                          type="date"
                          value={formData.due_date}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              due_date: e.target.value,
                            })
                          }
                          className="bg-transparent w-full outline-none cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="assignee">Responsável</label>
                  <input
                    id="assignee"
                    placeholder="Designar para..."
                    value={formData.assignee}
                    onChange={(e) =>
                      setFormData({ ...formData, assignee: e.target.value })
                    }
                    className="border border-slate-300 px-3 py-1 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 ">
                <button
                  onClick={() => onClose(false)}
                  className="flex p-2 justify-center cursor-pointer items-center w-full rounded-lg border border-slate-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex p-2 justify-center cursor-pointer items-center w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {task ? "Atualizar" : "Criar"} Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
