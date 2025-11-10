"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "../../../lib/validation/loginschema";
import { submitUserForm } from "../../../lib/actions/submituserformaction";
import { Mail, Lock, Eye, EyeOff, IdCard } from "lucide-react";
import { CPF_MASK } from "@/lib/mask";
import { IMaskInput } from "react-imask";
import { handleCpfVerify } from "@/lib/services/api/cpfvercel";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setSuccess(null);

    const result = await submitUserForm(data);

    if (!result.success) {
      setError(result.error ?? "Erro ao cadastrar.");
    } else {
      setSuccess(result.message ?? "Cadastro realizado com sucesso.");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-300 p-6 font-serif">
      <div className="w-full max-w-md bg-white/70 shadow-xl rounded-2xl text-emerald-800 p-8">
        <h2 className="text-3xl font-semibold text-center mb-6">Criar Conta</h2>

        {error && <p className="text-sm text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-sm text-green-600 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Nome completo
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="name"
                    type="name"
                    placeholder="Digite seu nome completo"
                    className="block w-full rounded-md border-gray-300 pl-10 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.name?.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              CPF
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IdCard className="h-5 w-5 text-gray-400" />
              </div>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                  {...field}
                  mask={CPF_MASK}
                  id="cpf"
                  placeholder="000.000.000-00"
                  onAccept={(value) => field.onChange(value)}
                  onBlur={async (e) => {
                    const message = await handleCpfVerify(e.currentTarget.value);
                    console.log(message);
                    if (message === "CPF inválido.") {
                      setError(message);
                    }
                  }}
                  className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                )}
              />
            </div>
            {errors.cpf && (
              <p className="mt-1 text-sm text-red-600">{errors.cpf?.message}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <div className="relative mt-1">
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
                    className="block w-full rounded-md border-gray-300 pl-10 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Senha
            </label>
            <div className="relative mt-1">
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
                    placeholder="Digite sua senha"
                    className="block w-full rounded-md border-gray-300 pl-10 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              Confirmar Senha
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repita a senha"
                    className="block w-full rounded-md border-gray-300 pl-10 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Botão de cadastro */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>

          {/* Voltar para login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-emerald-600 hover:underline"
            >
              Já tem conta? Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}