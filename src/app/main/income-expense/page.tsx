"use client";

import { Header } from "@/components/shared/header";
import { Navbar } from "@/components/shared/navbar/page";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Income() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const categoriesExpense = [
    "Selecione um categoria",
    "Alimentação",
    "Transporte",
    "Moradia",
    "Lazer",
    "Educação",
    "Saúde",
    "Outros",
  ];

  const categoriesIncome = ["Selecione um categoria", "Salário", "Outros"];

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

    if (
      type === "" ||
      category === "" ||
      category === "Selecione uma categoria"
    ) {
      setError(true);
      return;
    }

    try {
      await addDoc(collection(db, "transactions", user.uid, "items"), {
        value: parseFloat(value),
        type,
        category,
        createdAt: serverTimestamp(),
      });

      setValue("");
      setType("");
      setCategory("Selecione um categoria");
      setSuccess(true)
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
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
          <h2 className="text-xl font-bold mb-4 text-emerald-800">
            Nova Receita/Despesa
          </h2>

          {/* Valor */}
          <label className="block mb-2 text-emerald-700">Valor (R$)</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md mb-4"
          />

          {/* Tipo */}
          <label className="block mb-2 text-emerald-700">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
          >
            <option value="">Selecione uma opção</option>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>

          {/* Categoria */}
          <label className="block mb-2 text-emerald-700">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mb-4"
          >
            {type === "receita" &&
              categoriesIncome.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            {type === "despesa" &&
              categoriesExpense.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          <p className="text-red-600 mb-1">
            {error ? "Preencha todos os dados corretamente" : ""}
          </p>
          <p className="text-green-600 mb-1">
            {success ? "Dados inseridos com sucesso!" : ""}
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
