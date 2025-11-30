import { FormData } from "@/app/dashboard/components/TaskModal";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseconfig";
import { useEffect, useState } from "react";

// =====================================
//  CRIAR TAREFA
// =====================================
export const createTask = async (userId: string, task: FormData) => {
  const tasksRef = collection(db, "tasks", userId, "items");

  return await addDoc(tasksRef, {
    ...task,
    createdAt: Timestamp.now(), // obrigatório para orderBy
  });
};

// =====================================
//  LISTAR TODAS AS TAREFAS DO USUÁRIO
// =====================================
export function useAllTasks(userId: string | null) {
  const [allTasks, setAllTasks] = useState<any[] | null>(null);

  useEffect(() => {
    if (!userId) return;

    const tasksRef = collection(db, "tasks", userId, "items");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllTasks(tasks);
    });

    return () => unsubscribe();
  }, [userId]);

  return allTasks;
}

export function usePendingTasks(userId: string | null) {
  const allTasks = useAllTasks(userId);
  return allTasks?.filter((t) => t.status === "pendente") || [];
}

export function useProgressTasks(userId: string | null) {
  const allTasks = useAllTasks(userId);
  return allTasks?.filter((t) => t.status === "em andamento") || [];
}

export function useDoneTasks(userId: string | null) {
  const allTasks = useAllTasks(userId);
  return allTasks?.filter((t) => t.status === "finalizado") || [];
}

export function useUrgentsTasks(userId: string | null) {
  const allTasks = useAllTasks(userId);
  return allTasks?.filter((t) => t.category === "urgente") || [];
}

// =====================================
//  ATUALIZAR TAREFA
// =====================================
// export const updateTask = async (
//   userId: string,
//   taskId: string,
//   task: FormData
// ) => {
//   const taskRef = doc(db, "tasks", userId, "items", taskId);
//   return await updateDoc(taskRef, task);
// };

// =====================================
//  EXCLUIR TAREFA
// =====================================
export const deleteTask = async (userId: string, taskId: string) => {
  const taskRef = doc(db, "tasks", userId, "items", taskId);
  return await deleteDoc(taskRef);
};
