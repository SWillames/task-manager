const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Habilita CORS para permitir que o frontend acesse a API de qualquer origem/porta
app.use(cors());
app.use(express.json());

// --- Estado e Regras de Negócio ---
const tarefas = [];
let proximoCodigo = 0;

function validarDadosDaTarefa(titulo, prioridade) {
  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 5) {
    throw new Error("O título deve ter no mínimo 5 caracteres.");
  }
  const prioNum = Number(prioridade);
  if (isNaN(prioNum) || prioNum < 1 || prioNum > 3) {
    throw new Error("A prioridade deve ser um número entre 1 (Alta) e 3 (Baixa).");
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
    status: true // true = Em execução / Ativa
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

function excluirTarefa(codigo) {
  const index = tarefas.findIndex((t) => t.codigo === codigo);
  
  if (index === -1) {
    throw new Error(`Tarefa #${codigo} não encontrada.`);
  }

  // Remove o item do array na memória
  const [tarefaExcluida] = tarefas.splice(index, 1);
  return tarefaExcluida;
}

// --- Endpoints REST ---

app.get('/api/tarefas', (req, res) => {
  res.json({ sucesso: true, dados: listarTarefas() });
});

app.post('/api/tarefas', (req, res) => {
  try {
    const { titulo, prioridade } = req.body;
    const nova = cadastrarTarefa(titulo, prioridade);
    res.status(201).json({ sucesso: true, dados: nova });
  } catch (erro) {
    res.status(400).json({ sucesso: false, mensagem: erro.message });
  }
});

app.patch('/api/tarefas/:codigo/concluir', (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    const atualizada = concluirTarefa(codigo);
    res.json({ sucesso: true, dados: atualizada });
  } catch (erro) {
    res.status(400).json({ sucesso: false, mensagem: erro.message });
  }
});

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

app.delete('/api/tarefas/:codigo', (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    const removida = excluirTarefa(codigo);
    res.json({ sucesso: true, mensagem: `Tarefa #${codigo} removida com sucesso!`, dados: removida });
  } catch (erro) {
    res.status(404).json({ sucesso: false, mensagem: erro.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API rodando em http://localhost:${PORT}`);
});