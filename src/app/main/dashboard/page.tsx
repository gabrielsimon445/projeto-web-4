"use client";

import { cotacao, getCripto, getDolar } from "@/app/api";
import { PizzaGraph } from "@/components/features/dashboard/PizzaGraph";
import { Header } from "@/components/shared/header";
import { Navbar } from "@/components/shared/navbar/page";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Transaction {
  id: string;
  value: number;
  type: "receita" | "despesa";
  category: string;
  createdAt?: unknown;
}
interface Bill {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  createdAt?: unknown;
}

export default function DashboardPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [bills, setBills] = useState<Bill[]>([]);
  const [despesasCategoria, setDespesasCategoria] = useState([
    { categoria: "Alimentação", valor: 0 },
    { categoria: "Transporte", valor: 0 },
    { categoria: "Moradia", valor: 0 },
    { categoria: "Lazer", valor: 0 },
    { categoria: "Educação", valor: 0 },
    { categoria: "Saúde", valor: 0 },
    { categoria: "Outros", valor: 0 },
  ]);
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

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "transactions", user?.uid, "items"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      let receita = 0;
      let despesa = 0;

      const categorias = [
        { categoria: "Alimentação", valor: 0 },
        { categoria: "Transporte", valor: 0 },
        { categoria: "Moradia", valor: 0 },
        { categoria: "Lazer", valor: 0 },
        { categoria: "Educação", valor: 0 },
        { categoria: "Saúde", valor: 0 },
        { categoria: "Outros", valor: 0 },
      ];

      snapshot.forEach((doc) => {
        const data = doc.data() as Transaction;

        if (data.type === "receita") {
          receita += data.value;
        } else if (data.type === "despesa") {
          despesa += data.value;

          // Atualiza a categoria correspondente
          const catIndex = categorias.findIndex(
            (c) => c.categoria === data.category
          );
          if (catIndex >= 0) {
            categorias[catIndex].valor += data.value;
          }
        }
      });

      total = receita - despesa;

      setBalance(total);
      setIncome(receita);
      setExpense(despesa);
      setDespesasCategoria(categorias);
    });
    const qry = query(
      collection(db, "bills", user.uid, "items"),
      orderBy("dueDate", "asc")
    );

    const bills = onSnapshot(qry, (snapshot) => {
      const docs: Bill[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Bill, "id">;
        docs.push({ id: doc.id, ...data });
      });
      setBills(docs);
    });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      unsubscribe(), bills();
    };
  }, [user]);

  const [dolar, setDolar] = useState<string>("Carregando...");
  const [cripto, setCripto] = useState<cotacao>();
  const [btc, setBtc] = useState<number>();
  const [eth, setEth] = useState<number>();

  useEffect(() => {
    async function fetchDolar() {
      try {
        const valor = await getDolar();
        if (valor) {
          setDolar(`R$ ${parseFloat(valor).toFixed(2)}`);
        } else {
          setDolar("Cotação indisponível");
        }
      } catch (error) {
        console.error(error);
        setDolar("Erro ao buscar cotação");
      }
    }
    async function fetchCripto() {
      try {
        const valor = await getCripto();
        if (valor !== "Cotação não encontrada") {
          setCripto(valor);
        } else {
          console.log("Cotação não encontrada");
        }
      } catch (error) {
        console.error(error);
        console.log("Erro ao buscar cotação");
      }
    }

    fetchCripto();
    fetchDolar();
  }, []);

  useEffect(() => {
    setBtc(parseFloat(cripto?.BTCUSD.bid || "0"));
    setEth(parseFloat(cripto?.ETHUSD.bid || "0"));
  }, [cripto]);

  const isDueSoon = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3; // até 3 dias de antecedência
  };

  return (
    <div className="min-h-screen bg-emerald-300 text-emerald-800 font-serif p-9">
      <div className="max-w-6xl mx-auto">
        <Header />
        <Navbar />
        {/* Balanço Geral */}
        <section className="grid gap-6 md:grid-cols-3 mb-10">
          <Card
            title="Receitas"
            value={`R$ ${income.toFixed(2)}`}
            color="text-green-700"
          />
          <Card
            title="Despesas"
            value={`R$ ${expense.toFixed(2)}`}
            color="text-red-600"
          />
          <Card
            title="Saldo Atual"
            value={`R$ ${balance.toFixed(2)}`}
            color={balance >= 0 ? "text-green-700" : "text-red-700"}
          />
        </section>

        {/* Gráficos */}
        <section className="bg-white/70 shadow rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Distribuição de Despesas
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Placeholder gráfico de pizza */}
            <div className="h-full flex items-center justify-center bg-white/50 text-emerald-800 border rounded">
              <PizzaGraph data={despesasCategoria} />
            </div>
            {/* Tabela resumo */}
            <table className="w-full text-lg">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Categoria</th>
                  <th className="py-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {despesasCategoria
                  .filter((d) => d.valor !== 0)
                  .map((d) => (
                    <tr key={d.categoria} className="border-b last:border-none">
                      <td className="py-2">{d.categoria}</td>
                      <td className="py-2">R$ {d.valor.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Alertas de Vencimentos */}
        <section className="bg-white/70 shadow rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Contas a Vencer</h2>
          {bills.length === 0 ? (
            <p className="text-emerald-800">
              Nenhuma conta próxima do vencimento.
            </p>
          ) : (
            <ul className="space-y-3">
              {bills.map((a) => (
                <li
                  key={a.id}
                  className={`flex justify-between text-lg border-b pb-2 last:border-none ${
                    isDueSoon(a.dueDate) ? "text-red-600" : ""
                  }`}
                >
                  <span>
                    {a.description} –{" "}
                    {new Date(a.dueDate).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="font-semibold">R$ {a.value.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Cotações */}
        <section className="bg-white/70 shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Cotações</h2>
          <div className="flex gap-10">
            <div>
              <p className="text-sm text-emerald-800">Dólar (USD)</p>
              <p className="text-lg font-bold">{dolar.replaceAll(".", ",")}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-800">Bitcoin</p>
              <p
                className={`text-lg font-bold ${
                  parseInt(cripto?.BTCUSD.pctChange || "0") > 0
                    ? ""
                    : "text-red-600"
                }`}
              >
                $ {btc?.toLocaleString("pt-br")}{" "}
                {parseFloat(cripto?.BTCUSD.pctChange || "0") > 0 ? (
                  <TrendingUp className="inline-block w-4 h-4 ml-1 fill-green-600" />
                ) : (
                  <TrendingDown className="inline-block w-4 h-4 ml-1 fill-red-600" />
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-800">Ethereum</p>
              <p
                className={`text-lg font-bold ${
                  parseInt(cripto?.ETHUSD.pctChange || "0") > 0
                    ? ""
                    : "text-red-600"
                }`}
              >
                $ {eth?.toLocaleString("pt-br")}
                {parseFloat(cripto?.ETHUSD.pctChange || "0") > 0 ? (
                  <TrendingUp className="inline-block w-4 h-4 ml-1 fill-green-600" />
                ) : (
                  <TrendingDown className="inline-block w-4 h-4 ml-1 fill-red-600" />
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white/70 shadow rounded-2xl p-6 flex flex-col items-center justify-center">
      <h3 className="text-lg text-emerald-800 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
