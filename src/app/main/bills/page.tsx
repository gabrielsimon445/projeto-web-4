"use client";

import { Header } from "@/components/shared/header";
import { Navbar } from "@/components/shared/navbar/page";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BillsPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unLogged = onAuthStateChanged(auth, (userLogged) => {
      if (!userLogged) {
        router.push("/login");
      } else {
        setUser(userLogged);
      }
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await addDoc(collection(db, "bills", user.uid, "items"), {
        description,
        value: parseFloat(value),
        dueDate,
        createdAt: serverTimestamp(),
      });

      setDescription("");
      setValue("");
      setDueDate("");

      setSuccess(true);
    } catch (error) {
      console.error("Erro ao cadastrar conta:", error);
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-300 text-emerald-800 font-serif p-9">
      <div className="max-w-6xl mx-auto">
        <Header />
        <Navbar />
      </div>
      <div className="max-w-6xl mx-auto rounded-xl bg-white/70 text-emerald-800 flex p-10 mb-10">
        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-emerald-800">
            Cadastrar Conta a Pagar
          </h2>

          {/* Descrição */}
          <label className="block mb-2 text-emerald-700">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md mb-4"
          />

          {/* Valor */}
          <label className="block mb-2 text-emerald-700">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md mb-4"
          />

          {/* Data de vencimento */}
          <label className="block mb-2 text-emerald-700">
            Data de Vencimento
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md mb-4"
          />

          <p className="text-red-600 mb-1">
            {error ? "Erro ao cadastrar conta." : ""}
          </p>
          <p className="text-green-600 mb-1">
            {success ? "Conta cadastrada com sucesso" : ""}
          </p>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}
