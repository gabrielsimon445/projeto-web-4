"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { useEffect, useState } from "react";

// =====================================
//  TIPOS (agora compatíveis com TaskModal)
// =====================================

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskData {
  id?: string; // <--- adicionado
  title: string;
  description: string;
  due_date: string;
  priority: "baixa" | "media" | "alta";
  status: string;
  category?: string;
  subtasks: SubTask[];
  progress: number;
}

// =====================================
//  PROGRESS
// =====================================
export function calculateProgress(subtasks: SubTask[]): number {
  if (!subtasks || subtasks.length === 0) return 0;
  const doneCount = subtasks.filter((s) => s.done).length;
  return Math.round((doneCount / subtasks.length) * 100);
}

// =====================================
//  CRIAR TAREFA
// =====================================
export const createTask = async (userId: string, task: TaskData) => {
  const tasksRef = collection(db, "tasks", userId, "items");

  const progress = calculateProgress(task.subtasks);

  return await addDoc(tasksRef, {
    ...task,
    progress,
    createdAt: Timestamp.now(),
  });
};

// =====================================
//  LISTAR TAREFAS (REALTIME)
// =====================================
export function useAllTasks(userId: string | null) {
  const [allTasks, setAllTasks] = useState<TaskData[] | null>(null);

  useEffect(() => {
    if (!userId) return;

    const tasksRef = collection(db, "tasks", userId, "items");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as TaskData),
      }));

      setAllTasks(tasks);
    });

    return () => unsubscribe();
  }, [userId]);

  return allTasks;
}

// =====================================
//  FILTROS
// =====================================
export const usePendingTasks = (u: string | null) =>
  useAllTasks(u)?.filter((t) => t.status === "pendente") || [];

export const useProgressTasks = (u: string | null) =>
  useAllTasks(u)?.filter((t) => t.status === "em andamento") || [];

export const useDoneTasks = (u: string | null) =>
  useAllTasks(u)?.filter((t) => t.status === "finalizado") || [];

export const useUrgentsTasks = (u: string | null) =>
  useAllTasks(u)?.filter((t) => t.category === "urgente") || [];

// =====================================
//  ATUALIZAR TAREFA
// =====================================
export const updateTask = async (
  userId: string,
  taskId: string,
  task: TaskData
) => {
  const taskRef = doc(db, "tasks", userId, "items", taskId);

  const progress = calculateProgress(task.subtasks);

  // NUNCA envia `id` para o Firestore
  const payload = { ...task, id: undefined, progress };

  return await updateDoc(taskRef, payload);
};

// =====================================
//  ATUALIZAR SOMENTE SUBTAREFAS
// =====================================
export const updateSubTasks = async (
  userId: string,
  taskId: string,
  subtasks: SubTask[]
) => {
  const taskRef = doc(db, "tasks", userId, "items", taskId);

  const progress = calculateProgress(subtasks);

  return await updateDoc(taskRef, {
    subtasks,
    progress,
  });
};

// =====================================
//  EXCLUIR
// =====================================
export const deleteTask = async (userId: string, taskId: string) => {
  const taskRef = doc(db, "tasks", userId, "items", taskId);
  return await deleteDoc(taskRef);
};

// =====================================
//  ATUALIZAR STATUS
// =====================================
export const updateTaskStatus = async (
  userId: string,
  taskId: string,
  status: "pendente" | "em andamento" | "finalizado"
) => {
  const taskRef = doc(db, "tasks", userId, "items", taskId);

  return await updateDoc(taskRef, { status });
};
