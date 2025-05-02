# Desenrola 🧶

![Banner do Projeto](assets/logo_horizontal_o_novelo_de_la_white.png)

> Plataforma web moderna para gestão integrada de projetos, focada em otimizar processos, tecnologias e recursos, promovendo maior eficiência, alinhamento estratégico e bem-estar das equipes.

[![Licença MIT](https://img.shields.io/badge/Licença-MIT-green.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-blue)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

## 📌 Tabela de Conteúdos

- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Primeiros Passos](#-primeiros-passos)
- [Executando a Aplicação](#-executando-a-aplicação)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🗂️ Estrutura do Projeto

```text
desenrola-app/
├─ backend/               # Backend Node.js/Express
│  ├─ database/          # Configurações do banco de dados
│  ├─ prisma/            # ORM Prisma (schemas/migrations)
│  ├─ src/               # Código fonte TypeScript
│  └─ ...                # Configurações do projeto
├─ frontend/             # Frontend Next.js
│  ├─ public/            # Assets estáticos
│  ├─ src/               # Código fonte da aplicação
│  └─ ...                # Configurações do projeto
├─ docker-compose.yml    # Configuração de containers Docker
└─ ...                   # Outros arquivos de configuração
```

## 🛠️ Tecnologias

### **Frontend**
![Next.js](https://img.shields.io/badge/Next.js-14.x-000000?logo=next.js)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwind-css)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma)

### **Banco de Dados**
![SQLite](https://img.shields.io/badge/SQLite-Dev-003B57?logo=sqlite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prod-4169E1?logo=postgresql)

### **Ferramentas**
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-24.x-2496ED?logo=docker)

## 🚀 Primeiros Passos

### Pré-requisitos
- Node.js ≥ 18.x
- npm ≥ 9.x
- Docker ≥ 24.x
- Git

### Configuração Inicial
```bash
# Clonar repositório
git clone git@github.com:AdemarCastro/desenrola-app.git
cd desenrola-app

# Instalar dependências
./install-deps.bash
```

## ▶️ Executando a Aplicação

### Ambiente de Desenvolvimento
```bash
# Iniciar containers Docker (requer Docker Desktop em execução)
./init-env.bash

# Acessar aplicação:
# Frontend: http://localhost:3000
# Backend:  http://localhost:4000
# Prisma Studio: http://localhost:5555
```

### Parar Ambiente
```bash
# Finalizar containers e limpar recursos
./stop-env.bash
```

**Importante:** Todas as alterações na branch principal devem ser feitas via Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](./LICENSE) para mais informações.

---

**Desenvolvido por:**
- **[Ademar Castro](https://github.com/AdemarCastro)**
- **[Alice Karolyne]()**
- **[Carlos Alexandre]()**
- **[Jorge Luiz]()**
- **[Lucas Eduardo]()**