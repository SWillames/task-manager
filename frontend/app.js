// Aponta explicitamente para o backend independente na porta 3000
const API_BASE_URL = 'http://localhost:3000/api/tarefas';

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskPriority = document.getElementById('taskPriority');
const tasksList = document.getElementById('tasksList');
const toastMessage = document.getElementById('toastMessage');
const tasksCount = document.getElementById('tasksCount');

function showToast(message, type = 'error') {
  toastMessage.className = `toast show-${type}`;
  toastMessage.textContent = message;

  setTimeout(() => {
    toastMessage.className = 'toast';
    toastMessage.textContent = '';
  }, 4000);
}

function getPriorityBadge(priority) {
  if (priority === 1) return { text: 'Alta', className: 'badge-prio-1' };
  if (priority === 2) return { text: 'Média', className: 'badge-prio-2' };
  return { text: 'Baixa', className: 'badge-prio-3' };
}

function renderTasks(tarefas) {
  tasksCount.textContent = `${tarefas.length} ${tarefas.length === 1 ? 'item' : 'itens'}`;

  if (tarefas.length === 0) {
    tasksList.innerHTML = '<li class="empty-state">Nenhuma tarefa criada. Comece preenchendo o formulário acima!</li>';
    return;
  }

  tasksList.innerHTML = tarefas.map((t) => {
    const prio = getPriorityBadge(t.prioridade);
    const isCompleted = !t.status;

    return `
      <li class="task-card ${isCompleted ? 'is-done' : ''}">
        <div class="task-content">
          <span class="task-id">#${t.codigo}</span>
          <div class="task-details">
            <span class="task-title">${t.titulo}</span>
            <div class="task-tags">
              <span class="badge ${prio.className}">${prio.text}</span>
              <span class="badge badge-status">${t.status ? 'Em execução' : 'Concluída'}</span>
            </div>
          </div>
        </div>

        <div class="task-actions">
          ${!isCompleted ? `
            <button class="btn btn-icon" onclick="handleChangePriority(${t.codigo}, ${t.prioridade})">⚙ Prio</button>
            <button class="btn btn-icon btn-complete" onclick="handleCompleteTask(${t.codigo})">✓ Concluir</button>
          ` : `
            <span style="font-size: 0.85rem; color: var(--success); font-weight: 600;">✓ Finalizada</span>
          `}
          
          <!-- Botão de exclusão (disponível para ativas e concluídas) -->
          <button class="btn btn-icon btn-delete" onclick="handleDeleteTask(${t.codigo})" title="Excluir tarefa">🗑 Excluir</button>
        </div>
      </li>
    `;
  }).join('');
}

async function fetchTasks() {
  try {
    const response = await fetch(API_BASE_URL);
    const result = await response.json();
    if (result.sucesso) {
      renderTasks(result.dados);
    }
  } catch (err) {
    showToast('Não foi possível conectar à API. Verifique se o backend está ligado.', 'error');
  }
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: taskTitle.value,
        prioridade: Number(taskPriority.value)
      })
    });

    const result = await response.json();

    if (!result.sucesso) {
      showToast(result.mensagem, 'error');
      return;
    }

    taskTitle.value = '';
    taskPriority.value = '2';
    showToast('Tarefa criada com sucesso!', 'success');
    fetchTasks();
  } catch (err) {
    showToast('Erro ao criar tarefa no servidor.', 'error');
  }
});

async function handleCompleteTask(codigo) {
  try {
    const response = await fetch(`${API_BASE_URL}/${codigo}/concluir`, {
      method: 'PATCH'
    });
    const result = await response.json();

    if (!result.sucesso) {
      showToast(result.mensagem, 'error');
      return;
    }

    showToast(`Tarefa #${codigo} concluída com sucesso!`, 'success');
    fetchTasks();
  } catch (err) {
    showToast('Erro ao concluir a tarefa.', 'error');
  }
}

async function handleChangePriority(codigo, prioridadeAtual) {
  const novaPrioridade = prompt(
    `Alterar prioridade da tarefa #${codigo}:\n1 = Alta\n2 = Média\n3 = Baixa`,
    prioridadeAtual
  );

  if (!novaPrioridade) return;

  try {
    const response = await fetch(`${API_BASE_URL}/${codigo}/prioridade`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prioridade: Number(novaPrioridade) })
    });
    const result = await response.json();

    if (!result.sucesso) {
      showToast(result.mensagem, 'error');
      return;
    }

    showToast(`Prioridade da tarefa #${codigo} atualizada!`, 'success');
    fetchTasks();
  } catch (err) {
    showToast('Erro ao alterar prioridade da tarefa.', 'error');
  }
}

// Nova função para chamar a API:
async function handleDeleteTask(codigo) {
  const confirmou = confirm(`Tem certeza que deseja excluir a tarefa #${codigo}?`);
  if (!confirmou) return;

  try {
    const response = await fetch(`${API_BASE_URL}/${codigo}`, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (!result.sucesso) {
      showToast(result.mensagem, 'error');
      return;
    }

    showToast(`Tarefa #${codigo} excluída!`, 'success');
    fetchTasks();
  } catch (err) {
    showToast('Erro ao excluir tarefa no servidor.', 'error');
  }
}

// Carga inicial dos dados
fetchTasks();