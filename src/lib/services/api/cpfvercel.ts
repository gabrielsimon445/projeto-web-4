export async function handleCpfVerify(cpf: string): Promise<string> {
  const cpfClean = cpf.replace(/\D/g, "");
  if (cpfClean.length === 11) {
    try {
      const response = await fetch(
        `https://api-cpf.vercel.app/cpf/valid/${cpfClean}`
      );
      const data = await response.json();
      if (data.Valid) {
        return "CPF válido.";
      } else {
        return "CPF inválido.";
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao verificar CPF:", error.message);
        return "Erro ao verificar CPF.";
      } else {
        return "Erro desconhecido ao verificar CPF.";
      }
    }
  } else {
    return "CPF inválido.";
  }
}
