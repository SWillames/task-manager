const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// ==========================================
// 1. REGRAS DE NEGÓCIO E DADOS EM MEMÓRIA
// ==========================================
const tarefas = [];
let proximoCodigo = 0;

function validarDadosDaTarefa(titulo, prioridade) {
  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 5) {
    throw new Error("O título deve ter no mínimo 5 caracteres.");
  }
  const prioNum = Number(prioridade);
  if (isNaN(prioNum) || prioNum < 1 || prioNum > 3) {
    throw new Error("A prioridade deve ser um número entre 1 e 3.");
  }
}

function buscarTarefa(codigo) {
  const tarefa = tarefas.find((t) => t.codigo === codigo);
  if (!tarefa) {
    throw new Error(`Tarefa #${codigo} não encontrada.`);
  }
  return tarefa;
}

function cadastrarTarefa(titulo, prioridade) {
  validarDadosDaTarefa(titulo, prioridade);
  proximoCodigo++;
  const novaTarefa = {
    codigo: proximoCodigo,
    titulo: titulo.trim(),
    prioridade: Number(prioridade),
    status: true
  };
  tarefas.push(novaTarefa);
  return novaTarefa;
}

function listarTarefas() {
  return tarefas;
}

function concluirTarefa(codigo) {
  const tarefa = buscarTarefa(codigo);
  if (!tarefa.status) {
    throw new Error(`A tarefa #${codigo} já está concluída.`);
  }
  tarefa.status = false;
  return tarefa;
}

function alterarPrioridade(codigo, novaPrioridade) {
  const tarefa = buscarTarefa(codigo);
  validarDadosDaTarefa(tarefa.titulo, novaPrioridade);
  tarefa.prioridade = Number(novaPrioridade);
  return tarefa;
}

// ==========================================
// 2. ENDPOINTS DA API REST
// ==========================================

// Listar tarefas
app.get('/api/tarefas', (req, res) => {
  res.json({ sucesso: true, dados: listarTarefas() });
});

// Cadastrar tarefa
app.post('/api/tarefas', (req, res) => {
  try {
    const { titulo, prioridade } = req.body;
    const nova = cadastrarTarefa(titulo, prioridade);
    res.status(201).json({ sucesso: true, dados: nova });
  } catch (erro) {
    res.status(400).json({ sucesso: false, mensagem: erro.message });
  }
});

// Concluir tarefa
app.patch('/api/tarefas/:codigo/concluir', (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    const atualizada = concluirTarefa(codigo);
    res.json({ sucesso: true, dados: atualizada });
  } catch (erro) {
    res.status(400).json({ sucesso: false, mensagem: erro.message });
  }
});

// Alterar prioridade
app.patch('/api/tarefas/:codigo/prioridade', (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    const { prioridade } = req.body;
    const atualizada = alterarPrioridade(codigo, prioridade);
    res.json({ sucesso: true, dados: atualizada });
  } catch (erro) {
    res.status(400).json({ sucesso: false, mensagem: erro.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});