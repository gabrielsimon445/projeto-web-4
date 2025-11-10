"use client";

import { Header } from "@/components/shared/header";
import { Navbar } from "@/components/shared/navbar/page";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";

interface Transaction {
  id: string;
  value: number;
  type: "receita" | "despesa";
  category: string;
  createdAt?: Timestamp;
}

export default function Extract() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userLogged) => {
      if (!userLogged) {
        router.push("/login");
      } else {
        setUser(userLogged);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user?.uid) return;

    const qry = query(
      collection(db, "transactions", user.uid, "items"),
      orderBy("createdAt", "desc")
    );

    const transaction = onSnapshot(qry, (snapshot) => {
      const docs: Transaction[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Transaction, "id">;
        docs.push({ id: doc.id, ...data });
      });
      setTransactions(docs);
    });

    return () => { 
      transaction();
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-emerald-300 text-emerald-800 font-serif p-9">
      <div className="max-w-6xl mx-auto">
        <Header />
        <Navbar />
      </div>
      <div className="max-w-6xl mx-auto text-xl rounded-xl bg-white/70 text-emerald-800 flex p-4 md:p-10 mb-10">
        <div className="w-full">
            <h2 className="text-3xl font-bold mb-6">Extrato</h2>
            {transactions.length === 0 ? (
              <p className="text-lg">Nenhuma transação encontrada.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b-2 border-emerald-800 p-4 text-left">Categoria</th>
                            <th className="border-b-2 border-emerald-800 p-4 text-left">Tipo</th>
                            <th className="border-b-2 border-emerald-800 p-4 text-left">Valor</th>
                            <th className="border-b-2 border-emerald-800 p-4 text-left">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-emerald-100">
                                <td className="border-b border-emerald-800 p-4">{transaction.category}</td>
                                <td className="border-b border-emerald-800 p-4 capitalize">{transaction.type}</td>
                                <td className={`border-b border-emerald-800 p-4 ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.type === 'receita' ? '+' : '-'} R$ {transaction.value.toFixed(2)}
                                </td>
                                <td className="border-b border-emerald-800 p-4 capitalize">
                                    {transaction.createdAt
                                        ? transaction.createdAt.toDate().toLocaleDateString()
                                        : ""}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
}
