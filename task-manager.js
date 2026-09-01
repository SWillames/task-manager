const prompt = require("prompt-sync")({ sigint: true });

// ==========================================
// 1. DADOS E REGRAS DE NEGÓCIO
// ==========================================
const tarefas = [];
let proximoCodigo = 0;

function validarDadosDaTarefa(titulo, prioridade) {
  if (!titulo || titulo.trim().length < 5) {
    throw new Error("O título deve ter no mínimo 5 caracteres.");
  }
  if (isNaN(prioridade) || prioridade < 1 || prioridade > 3) {
    throw new Error("A prioridade deve ser um número entre 1 (Alta) e 3 (Baixa).");
  }
}

function buscarTarefa(codigo) {
  const tarefa = tarefas.find((t) => t.codigo === codigo);
  if (!tarefa) {
    throw new Error(`Tarefa com o código #${codigo} não foi encontrada.`);
  }
  return tarefa;
}

function cadastrarTarefa(titulo, prioridade) {
  validarDadosDaTarefa(titulo, prioridade);
  proximoCodigo++;
  const novaTarefa = {
    codigo: proximoCodigo,
    titulo: titulo.trim(),
    prioridade,
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
  tarefa.prioridade = novaPrioridade;
  return tarefa;
}

// ==========================================
// 2. MENU INTERATIVO SÍNCRONO
// ==========================================
function main() {
  let rodando = true;

  while (rodando) {
    console.log("\n=============================");
    console.log("    GERENCIADOR DE TAREFAS   ");
    console.log("=============================");
    console.log("1. Cadastrar tarefa");
    console.log("2. Listar tarefas");
    console.log("3. Alterar prioridade");
    console.log("4. Concluir tarefa");
    console.log("0. Sair");

    const opcao = prompt("\nEscolha uma opção: ");

    if (opcao === null || opcao.trim() === "0") {
      console.log("\nEncerrando a aplicação...");
      rodando = false;
      break;
    }

    try {
      switch (opcao.trim()) {
        case "1": {
          const titulo = prompt("Título da tarefa (mín. 5 letras): ");
          const prioridade = Number(prompt("Prioridade (1 - Alta, 2 - Média, 3 - Baixa): "));
          const nova = cadastrarTarefa(titulo, prioridade);
          console.log(`\n[SUCESSO] Tarefa #${nova.codigo} ("${nova.titulo}") cadastrada!`);
          break;
        }

        case "2": {
          const lista = listarTarefas();
          if (lista.length === 0) {
            console.log("\n[INFO] Nenhuma tarefa cadastrada até o momento.");
          } else {
            console.log("\n--- LISTA DE TAREFAS ---");
            lista.forEach((t) => {
              const status = t.status ? "Em execução" : "Concluída";
              console.log(`[#${t.codigo}] ${t.titulo} | Prioridade: ${t.prioridade} | Status: ${status}`);
            });
          }
          break;
        }

        case "3": {
          const codigo = Number(prompt("Código da tarefa a alterar: "));
          const prioridade = Number(prompt("Nova prioridade (1 a 3): "));
          alterarPrioridade(codigo, prioridade);
          console.log(`\n[SUCESSO] Prioridade da tarefa #${codigo} atualizada para ${prioridade}!`);
          break;
        }

        case "4": {
          const codigo = Number(prompt("Código da tarefa a concluir: "));
          concluirTarefa(codigo);
          console.log(`\n[SUCESSO] Tarefa #${codigo} marcada como concluída!`);
          break;
        }

        default:
          console.log("\n[AVISO] Opção inválida! Digite um número de 0 a 4.");
      }
    } catch (erro) {
      console.log(`\n[ERRO]: ${erro.message}`);
    }
  }
}

main();