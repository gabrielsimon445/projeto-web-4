import { Card } from "@/components/shared/card";
import { Calendar, User } from "lucide-react";

export function TaskInfo() {
  
  const dot = "bg-green-500";
  const titulo = "Tarefa Exemplo";
  const badgeColor = "bg-blue-100 border-blue-300 text-blue-800";
  const estadoColor = "bg-slate-100 border-slate-300 text-slate-800";
  const badgeContent = "pessoal";
  const descricao =
    "Esta é uma descrição breve da tarefa para dar mais contexto ao usuário Esta é uma descrição breve da tarefa para dar mais contexto ao usuárioEsta é uma descrição breve da tarefa para dar mais contexto ao usuário.";
  const data = "24 Nov";
  const usuario = "Douglas";
  const estado = "to do";

  return (
    <Card
      variant="default"
      classname="w-full !bg-slate-100 border border-slate-300 !p-4"
    >
      <div className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${dot}`} />
            <h1 className="font-semibold">{titulo}</h1>
          </div>
          <div
            className={`px-3 border rounded-lg shadow-md text-sm ${badgeColor}`}
          >
            {badgeContent}
          </div>
        </header>
        <span className="text-[14px] block truncate w-96">{descricao}</span>
        <footer className="flex items-center justify-between">
          <div className="flex gap-3">
            <span className="flex items-center text-[12px]">
              <Calendar height={13} />
              {data}
            </span>
            <span className="flex items-center text-[12px]">
              <User height={13} />
              {usuario}
            </span>
          </div>
          <div className={`px-3 border rounded-lg text-sm ${estadoColor}`}>
            <span>{estado}</span>
          </div>
        </footer>
      </div>
    </Card>
  );
}
