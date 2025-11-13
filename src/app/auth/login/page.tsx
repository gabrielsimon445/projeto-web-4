"use client";

import {
  type LoginFormData,
  loginSchema,
} from "../../../lib/validation/loginschema";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  sendPasswordResetAction,
  signInAction,
  signInWithGitHub,
  signInWithGoogle,
} from "../../../lib/actions/useauth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Github, Loader2 } from "lucide-react";
import { BsGoogle } from "react-icons/bs";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setSuccess(null);
    const result = await signInAction(data);
    if (!result.user?.emailVerified) {
      setError("Verifique seu e-mail e tente novamente");
      return;
    }
    if (result.success && result.user?.emailVerified) {
      setSuccess("Login realizado com sucesso!");
      if (result.user?.uid !== undefined) {
        localStorage.setItem("uid", result.user?.uid);
      }
      setTimeout(() => router.push("/dashboard"), 1000);
    } else {
      setError(result.error || "Falha no login.");
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setSuccess(null);
    const email = getValues("email");

    if (!email) {
      setError("Por favor, digite seu e-mail primeiro para recuperar a senha.");
      return;
    }

    const result = await sendPasswordResetAction(email);
    if (result.success) {
      setSuccess(
        result.message ?? "E-mail de recuperação enviado com sucesso!"
      );
    } else {
      setError(result.error ?? "Erro ao enviar e-mail de recuperação.");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    setLoadingProvider("google");

    try {
      const result = await signInWithGoogle();
      if (result.success && result.user?.emailVerified) {
        setSuccess("Login com Google realizado com sucesso!");
        if (result.user?.uid !== undefined) {
          localStorage.setItem("uid", result.user?.uid);
        }
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        if (!result.user?.emailVerified) {
          setError("Verifique seu e-mail e tente novamente");
        } else {
          setError(result.error || "Falha no login com Google.");
        }
      }
    } catch (error) {
      setError("Erro inesperado ao fazer login com Google.");
      console.error("Google login error:", error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGitHubLogin = async () => {
    setError(null);
    setSuccess(null);
    setLoadingProvider("github");

    try {
      const result = await signInWithGitHub();
      if (result.success && result.user?.emailVerified) {
        setSuccess("Login com GitHub realizado com sucesso!");
        if (result.user?.uid !== undefined) {
          localStorage.setItem("uid", result.user?.uid);
        }
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        if (!result.user?.emailVerified) {
          setError("Verifique seu e-mail e tente novamente");
        } else {
          setError(result.error || "Falha no login com GitHub.");
        }
      }
    } catch (error) {
      setError("Erro inesperado ao fazer login com GitHub.");
      console.error("GitHub login error:", error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="bg-[#FAFAF9] flex w-screen h-screen">
      <div className="w-1/3 m-auto bg-white/70 shadow-xl rounded-2xl text-slate-800 p-8">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <p className="text-sm text-red-600 text-center mb-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-800 text-center mb-2">{success}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              E-mail
            </label>
            <div className="relative mt-1 border border-slate-300 rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    className="block w-full rounded-lg pl-10 p-2 sm:text-sm"
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Senha
            </label>
            <div className="relative mt-1 border border-slate-300 rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="block w-full rounded-lg pl-10 p-2 sm:text-sm"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-slate-700">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="font-medium text-indigo-600 hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm text-indigo-600 mb-2">Ou entre com</div>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loadingProvider !== null}
              className="cursor-pointer border bg-black/10 hover:shadow-lg p-2 rounded w-32 flex items-center justify-center gap-1"
            >
              {loadingProvider === "google" ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <BsGoogle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {loadingProvider === "google" ? "Conectando..." : "Google"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={loadingProvider !== null}
              className="cursor-pointer border bg-black/10 hover:shadow-lg p-2 rounded w-32 flex items-center justify-center gap-1"
            >
              {loadingProvider === "github" ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Github className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {loadingProvider === "github" ? "Conectando..." : "GitHub"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
