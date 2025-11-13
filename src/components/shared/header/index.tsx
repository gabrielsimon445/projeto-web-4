import { motion } from "framer-motion";
import { ArrowRight, CheckSquare } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">TaskFlow</span>
          </div>

          <div className="flex items-center gap-3 hover:cursor-pointer">
            <div className="py-2 px-4 text-gray-700 hover:text-indigo-600 hover:bg-slate-400/10 rounded-lg">
              <Link href="/login">Entrar</Link>
            </div>
            <Link
              href="/signup"
              className="flex items-center py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30"
            >
              Cadastrar-se
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};
