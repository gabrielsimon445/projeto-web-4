
# TaskFlow — Guia para clonar, instalar e rodar localmente

Projeto baseado em Next.js com autenticação e persistência via Firebase (Auth + Firestore).

Links importantes
- Vercel: https://task-flow-douglas.vercel.app/
- GitHub: https://github.com/gabrielsimon445/projeto-web-4

Pré-requisitos
- Node.js (recomendo v18+). Verifique com `node -v`.
- npm (ou `pnpm` / `yarn`). Verifique com `npm -v`.
- Conta no Firebase (opcional para rodar com backend real). Firestore e Auth devem estar configurados se quiser testar todas as features.

Passo a passo

1) Clonar o repositório

```powershell
git clone https://github.com/gabrielsimon445/projeto-web-4.git
cd projeto-web-4
```

2) Instalar dependências

```powershell
npm install
# ou, se usar pnpm:
pnpm install
# ou, se usar yarn:
yarn install
```

3) Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as chaves do Firebase. Exemplo mínimo:

```
NEXT_PUBLIC_FIREBASE_API_KEY=SuaApiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=mensagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=appId
```

Observação: o arquivo `.env.local` NÃO deve ser comitado.

4) Configurar o Firebase (console)

- No Firebase Console: crie um projeto e ative o Firestore e o Authentication (Email/Password e/ou Google).
- Se usar OAuth (Google/GitHub), configure os provedores no console do Firebase e insira os redirect URIs se necessário.
- O arquivo `src/lib/firebase/firebaseconfig.ts` espera as variáveis públicas (NEXT_PUBLIC_*). Confirme que seu `firebaseconfig` lê essas variáveis.

5) Rodar em modo desenvolvimento

```powershell
npm run dev
# após iniciar, abra http://localhost:3000
```

6) Build e execução em produção (opcional)

```powershell
npm run build
npm run start
# o servidor rodará em http://localhost:3000
```

Comandos úteis
- Lint (se disponível): `npm run lint`
- Testes (se disponíveis): `npm run test`

Estrutura e pontos-chave do projeto
- Código fonte principal: `src/app/` (App Router do Next.js).
- Configuração Firebase: `src/lib/firebase/firebaseconfig.ts`.
- Lógica de tarefas e serviços: `src/lib/actions/taskService.ts`.
- Kanban / Drag & Drop: `src/app/kanban/`.
- Calendar: `src/app/calendar/page.tsx`.
- Sugestão para tipos centrais: `src/types/models.ts` (não incluído por padrão — você pode criar seguindo o modelo `Task`/`Subtask`).

Dicas e resolução de problemas
- Erro relacionado a variáveis de ambiente: verifique se `.env.local` está na raiz e reinicie o servidor.
- Erros do Firebase (autenticação/regras): verifique as regras do Firestore e se o projeto correto está sendo usado.
- Dependências incompatíveis: delete `node_modules` e `package-lock.json` e rode `npm install` novamente.

Contato
- Repositório: https://github.com/gabrielsimon445/projeto-web-4
- Deploy (Vercel): https://task-flow-douglas.vercel.app/
