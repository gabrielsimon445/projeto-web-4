import { auth } from "@/lib/firebase/firebaseconfig";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // redireciona depois do logout
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="w-full min-h-fit text-xl rounded-xl font-semibold bg-white/70 text-emerald-800 flex justify-between p-4 mb-10">
      <div className="flex flex-col md:flex-row gap-1 md:gap-10 w-fit md:w-full justify-center mr-10">
        <Link
          href="/dashboard"
          className="w-3/12 py-1 hover:bg-black/10 rounded-xl text-center"
        >
          Dashboard
        </Link>
        <Link
          href="/extrato"
          className="w-3/12 py-1 hover:bg-black/10 rounded-xl text-center"
        >
          Extrato
        </Link>
        <Link
          href="/receita-despesa"
          className="w-3/12 py-1 hover:bg-black/10 rounded-xl text-center"
        >
          Receita/Despesa
        </Link>
        <Link
          href="/contas"
          className="w-3/12 py-1 hover:bg-black/10 rounded-xl text-center"
        >
          Contas
        </Link>
        <Link
          href="/perfil"
          className="w-3/12 py-1 hover:bg-black/10 rounded-xl text-center"
        >
          Perfil
        </Link>
      </div>
      <button
        className="w-fit px-2 md:w-3/12 py-1 bg-emerald-800 rounded-xl text-center text-white hover:cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};
