# desenrola-app

Aplicação full-stack **desenrola-app** composta por:

- **Frontend**: interface construída com Next.js  
- **Backend**: API REST com Node.js, Express e TypeScript  
- **Banco de Dados**: SQLite/PostgreSQL gerenciado pelo Prisma ORM  

---

## 📂 Estrutura dos Diretórios

```text
desenrola-app/
├─ backend/
│  ├─ prisma/
│  │  ├─ data/
│  │  │  ├─ dev.db
│  │  │  └─ dev.db-journal
│  │  ├─ migrations/
│  │  │  ├─ 20250430003106_init/
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  └─ schema.prisma
│  ├─ src/
│  │  └─ server.ts
│  ├─ .env
│  ├─ .gitignore
│  ├─ package-lock.json
│  ├─ package.json
│  └─ tsconfig.json
├─ frontend/
│  ├─ .next/
│  ├─ public/
│  ├─ src/
│  │  └─ app/
│  │     ├─ favicon.ico
│  │     ├─ globals.css
│  │     ├─ layout.tsx
│  │     └─ page.tsx
│  ├─ .gitignore
│  ├─ eslint.config.mjs
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ README.md
│  └─ tsconfig.json
├─ LICENSE
└─ README.md
```

---

## ✨ Tecnologias

- **Frontend**  
  - Next.js  
  - React  
  - TypeScript  
  - Tailwind CSS
  - ESLint
- **Backend**  
  - Node.js  
  - Express  
  - TypeScript  
  - Prisma ORM  
- **Banco de Dados**  
  - SQLite (ambiente de desenvolvimento)
  - PostgreSQL (ambiente de produção)

---

## 🚀 Como Rodar a Aplicação

### 1. Pré-requisitos

- Node.js ≥ 16  
- npm ≥ 8  

---

### 2. Clonar o repositório

```bash
git clone https://github.com/ademarcastro/desenrola-app.git
cd desenrola-app
```

---

### 3. Backend

```bash
cd backend
npm install
```

1. Configure as variáveis em `.env`:
   ```env
   DATABASE_URL="file:./prisma/data/dev.db"
   ```
2. Gere o banco e o client do Prisma:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```
   A API estará disponível em `http://localhost:4000`.

---

### 4. Frontend

```bash
cd ../frontend
npm install
```

1. (Opcional) crie um `.env` se precisar de variáveis de ambiente para API ou chaves.
2. Inicie o Next.js:
   ```bash
   npm run dev
   ```
   A interface estará em `http://localhost:3000`.

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE).