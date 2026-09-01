# ⚡ Gerenciador de Tarefas — Etapa 3 (Arquitetura Desacoplada + UI/UX)

Terceira etapa do projeto, implementando uma arquitetura desacoplada completa: uma API REST independente no Backend e uma SPA (Single Page Application) com foco em UI/UX no Frontend.

---

## 🎯 Objetivos de Aprendizagem
- Separação estrita de responsabilidades entre Backend e Frontend.
- Gerenciamento de **CORS (Cross-Origin Resource Sharing)**.
- Design de interface moderna: Dark mode, tipografia Inter, feedback visual com toasts reativos e estados de tarefas.
- Organização modular de código frontend (`index.html`, `style.css` e `app.js`).

---

## 📁 Estrutura do Projeto

```text
task-manager/
├── backend/          # API REST Express (porta 3000)
│   ├── server.js
│   └── package.json
└── frontend/         # Cliente estático desacoplado (HTML + CSS + JS)
    ├── index.html
    ├── style.css
    └── app.js
```

---

## 🚀 Como Executar

### 1. Iniciar o Backend
```bash
cd backend
npm install
node server.js
# API rodando em http://localhost:3000
```

### 2. Iniciar o Frontend
Em outro terminal:
```bash
cd frontend
# Utilizando a extensão Live Server do VS Code ou:
npx serve .
```
Abra o endereço informado pelo servidor estático no navegador.