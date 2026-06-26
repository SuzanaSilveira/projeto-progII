let todosInteresses = [];
let currentFilter = 'todos';
let modalEmail = '', modalNome = '', modalAnimal = '';

/* ════════════════════════════════════════
   BUSCAR DA API
════════════════════════════════════════ */
async function carregarInteresses() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const token = btoa(`${usuario.id}:${usuario.email}`);

    const res = await fetch('/api/admin/contatos', {
      headers: {
        'Authorization': token
      }
    });
    
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const dados = await res.json();

    todosInteresses = dados.contatos.map(c => ({
      id: c.id,
      nome: c.adotante_nome || 'Usuário desconhecido',
      email: c.adotante_email || '',
      avatar: iniciais(c.adotante_nome),
      av: corAvatar(c.id),
      animal: c.animal_nome || 'Animal',
      data: formatarData(c.data_contato),
      status: c.status || 'pendente',
      msg: c.mensagem || '',
    }));

    updateStats();
    renderCards(currentFilter);
  } catch (e) {
    console.error(e);
    document.getElementById('cards-list').innerHTML = `
      <div class="empty-state">
        <p>Não foi possível carregar os interesses.<br><small>${e.message}</small></p>
      </div>`;
  }
}

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
function iniciais(nome) {
  if (!nome) return '?';
  return nome.trim().split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

const CORES = ['av-green', 'av-blue', 'av-amber', 'av-coral', 'av-purple'];
function corAvatar(id) {
  return CORES[id % CORES.length];
}

function formatarEspecie(especie, raca) {
  if (!especie) return '';
  return raca ? `${especie} · ${raca}` : especie;
}

function formatarData(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ════════════════════════════════════════
   STATS
════════════════════════════════════════ */
function updateStats() {
  document.getElementById('stat-total').textContent = todosInteresses.length;
  document.getElementById('stat-new').textContent =
    todosInteresses.filter(i => i.status === 'pendente').length;
  document.getElementById('stat-animals').textContent =
    new Set(todosInteresses.map(i => i.animal)).size;
}

/* ════════════════════════════════════════
   RENDER
════════════════════════════════════════ */
function renderCards(filter) {
  const list = document.getElementById('cards-list');

  // a tabela usa 'pendente'/'visto'; os filtros usam 'novo'/'visto'
  const filtered = todosInteresses.filter(i => {
    if (filter === 'todos') return true;
    if (filter === 'novo') return i.status === 'pendente';
    if (filter === 'visto') return i.status === 'visto';
    return true;
  });

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <p>Nenhum interesse encontrado para este filtro.</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(item => `
    <article class="interest-card ${item.status === 'pendente' ? 'novo' : ''}" id="card-${item.id}">
      <div class="card-top">
        <div class="card-left">
          <div class="avatar ${item.av}">${item.avatar}</div>
          <div>
            <div class="user-name">${item.nome}</div>
            <div class="user-email">${item.email}</div>
          </div>
        </div>
        <span class="${item.status === 'pendente' ? 'badge-novo' : 'badge-visto'}">
          ${item.status === 'pendente' ? 'Novo' : 'Visto'}
        </span>
      </div>

      <div class="card-animal">
        <div class="animal-dot"></div>
        <div class="animal-chip-text">
          ${item.animal}<span>${item.especie}</span>
        </div>
      </div>

      <div class="msg-box">${item.msg}</div>

      <div class="card-footer">
        <div class="card-date">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${item.data}
        </div>
        <div class="card-actions">
          ${item.status === 'pendente' ? `
            <button class="btn-mark" onclick="marcarVisto(${item.id})">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Marcar como visto
            </button>` : ''}
          <button class="btn-contact" onclick="abrirModal('${item.email}','${item.nome}','${item.animal}')">
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Contatar
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

/* ════════════════════════════════════════
   MARCAR COMO VISTO
════════════════════════════════════════ */
async function marcarVisto(id) {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const token = btoa(`${usuario.id}:${usuario.email}`);

    await fetch(`/api/admin/contatos/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ status: 'visto' })
    });
  } catch (_) { /* falha silenciosa */ }

  const item = todosInteresses.find(i => i.id === id);
  if (item) item.status = 'visto';
  updateStats();
  renderCards(currentFilter);
}

/* ════════════════════════════════════════
   MODAL
════════════════════════════════════════ */
function abrirModal(email, nome, animal) {
  modalEmail = email; modalNome = nome; modalAnimal = animal;
  document.getElementById('modal-name').textContent = nome;
  document.getElementById('modal-animal').textContent = animal;
  document.getElementById('modal-email-name').textContent = nome;
  document.getElementById('modal-email').textContent = email;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function openEmail() {
  const subject = encodeURIComponent('Amigo Fiel — Interesse em adoção');
  const body = encodeURIComponent(
    `Olá ${modalNome},\n\nRecebemos seu interesse em adotar ${modalAnimal} através da plataforma Amigo Fiel.\n\nGostaríamos de conversar mais sobre o processo de adoção e conhecer melhor o seu perfil.\n\nAtenciosamente,\nEquipe Amigo Fiel`
  );
  window.open(`mailto:${modalEmail}?subject=${subject}&body=${body}`);
  closeModal();
}

/* ════════════════════════════════════════
   EVENTOS
════════════════════════════════════════ */
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.dataset.filter;
    renderCards(currentFilter);
  });
});

/* Init */
carregarInteresses();