import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-emerald-300 text-emerald-800 font-serif w-full min-h-dvh p-9">
      <header className="flex w-full items-center justify-between">
        <h1 className="font-bold text-2xl">FinTrack</h1>
        <div className="flex flex-col gap-1 items-end md:flex-row md:gap-8">
          <Link href="/login" className="hover:cursor-pointer py-2">
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="bg-emerald-800 px-4 py-2 rounded-full text-white hover:cursor-pointer"
          >
            Cadastrar-se
          </Link>
        </div>
      </header>
      <section>
        <div className="w-full md:p-10 justify-between">
          <div className="w-full my-auto flex gap-60 min-h-full">
            <div className="pt-10">
              <div className="flex justify-between">
                <div className="w-full">
                  <h1 className="text-4xl w-full md:text-8xl">Suas Finaças</h1>
                  <h1 className="text-4xl w-full md:text-8xl">Em Boas Mãos</h1>
                </div>
                <div className="md:hidden flex justify-end">
                  <Image src="/globe.png" alt="globe" width={200} height={50} />
                </div>
              </div>
              <p className="texte-md my-8 md:text-lg">
                Seu sistema de gestão financeira de maneira simples e
                descomplicada
              </p>
              <div className="text-white bg-emerald-800 text-sm md:text-lg py-2 px-4 rounded-full hover:cursor-pointer">
                <Link href="/cadastro">
                  Registre-se e comece a organizar suas finanças
                </Link>
              </div>
            </div>
            <div className="hidden md:inline">
              <Image src="/globe.png" alt="globe" width={400} height={400} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
