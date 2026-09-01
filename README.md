# 🌐 Gerenciador de Tarefas — Etapa 2 (Monolito Integrado)

Segunda etapa do projeto, evoluindo a aplicação de terminal para uma arquitetura cliente-servidor integrada com Node.js, Express e HTML nativo.

---

## 🎯 Objetivos de Aprendizagem
- Criação de servidores HTTP com **Express**.
- Implementação de endpoints REST (`GET`, `POST`, `PATCH`).
- Servir arquivos estáticos da pasta `public/` via `express.static`.
- Consumo assíncrono de APIs no frontend utilizando `fetch()` (Promises / `async/await`).
- Manipulação dinâmica do DOM e formulários HTML nativos (sem estilos/UI complexa).

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/tarefas` | Retorna todas as tarefas |
| `POST` | `/api/tarefas` | Cria uma nova tarefa |
| `PATCH` | `/api/tarefas/:codigo/concluir` | Marca uma tarefa como concluída |
| `PATCH` | `/api/tarefas/:codigo/prioridade` | Atualiza o nível de prioridade |

---

## 🚀 Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   node server.js
   ```

3. Acesse a interface web no navegador:
   ```text
   http://localhost:3000
   ```