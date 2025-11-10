"use client";

import { Header } from "@/components/shared/header";
import { Navbar } from "@/components/shared/navbar/page";
import { auth } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import defaultProfile from "../../../../public/images.png"

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <div className="min-h-screen bg-emerald-300 text-emerald-800 font-serif p-9">
      <div className="max-w-6xl mx-auto">
        <Header />
        <Navbar />
      </div>
      <div className="max-w-6xl mx-auto text-xl rounded-xl bg-white/70 text-emerald-800 flex p-4 md:p-10 mb-10">
        <div className="w-full">
          <Image
            src={user?.photoURL ?? defaultProfile}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="object-cover rounded-full"
          />
          <p className="font-semibold mt-4">Nome:</p>
          <p>{user?.displayName}</p>
          <p className="font-semibold mt-4">E-mail:</p>
          <p className="break-words">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
