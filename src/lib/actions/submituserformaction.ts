"use client";

import { type SignupFormData } from "../validation/loginschema";
import { FirebaseError } from "firebase/app";
import { signUpWithEmailAndPassword } from "./useauth";

export const submitUserForm = async (data: SignupFormData) => {
  try {
    const signUpResult = await signUpWithEmailAndPassword({
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    
    if (!signUpResult.success) {
      return { success: false, error: signUpResult.error };
    }

    return { success: true, message: "Conta criada e dados salvos com sucesso!" };
    
  } catch (error) {
    let errorMessage = "Ocorreu um erro ao enviar o formulário.";
    if (error instanceof FirebaseError) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};