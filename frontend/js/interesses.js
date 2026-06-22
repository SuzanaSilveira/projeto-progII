
/* ── DATA (substituir por chamada de API) ── */
const interesses = [
  {
    id: 1, nome: 'Ana Souza', email: 'ana.souza@gmail.com',
    avatar: 'AS', av: 'av-green',
    animal: 'Bolinha', especie: 'Cão · SRD',
    data: '22 jun 2025', status: 'novo',
    msg: 'Olá! Eu tenho um apartamento com área de lazer e sempre sonhei em ter um cachorro. Vi o Bolinha e me apaixonei. Moro sozinha mas trabalho em home office, então ele não ficaria sozinho.'
  },
  {
    id: 2, nome: 'Carlos Mendes', email: 'carlos.m@hotmail.com',
    avatar: 'CM', av: 'av-blue',
    animal: 'Mel', especie: 'Gato · Persa',
    data: '21 jun 2025', status: 'novo',
    msg: 'Tenho experiência com gatos há mais de 10 anos e adorei a Mel. Ela tem um temperamento que combina muito com meu estilo de vida tranquilo.'
  },
  {
    id: 3, nome: 'Patrícia Lima', email: 'paty.lima@outlook.com',
    avatar: 'PL', av: 'av-amber',
    animal: 'Thor', especie: 'Cão · Labrador',
    data: '19 jun 2025', status: 'visto',
    msg: 'Tenho uma casa com quintal grande e duas crianças que adoram animais. O Thor seria perfeito para nossa família! Já tivemos labradores antes.'
  },
  {
    id: 4, nome: 'Roberto Carvalho', email: 'rcarvalho@empresa.com.br',
    avatar: 'RC', av: 'av-coral',
    animal: 'Bolinha', especie: 'Cão · SRD',
    data: '18 jun 2025', status: 'visto',
    msg: 'Minha família está procurando um companheiro para nosso filho de 7 anos. O Bolinha parece ser muito dócil e amigável.'
  },
  {
    id: 5, nome: 'Fernanda Oliveira', email: 'fer.oliveira@gmail.com',
    avatar: 'FO', av: 'av-purple',
    animal: 'Nina', especie: 'Gato · Siamês',
    data: '17 jun 2025', status: 'visto',
    msg: 'Sou veterinária e garanto que a Nina teria todo o cuidado necessário. Tenho outra gata que é muito sociável, acho que elas se dariam bem.'
  }
];

let currentFilter = 'todos';
let modalEmail = '', modalNome = '', modalAnimal = '';

function updateStats() {
  document.getElementById('stat-total').textContent = interesses.length;
  document.getElementById('stat-new').textContent = interesses.filter(i => i.status === 'novo').length;
  const animais = new Set(interesses.map(i => i.animal));
  document.getElementById('stat-animals').textContent = animais.size;
}

function renderCards(filter) {
  const list = document.getElementById('cards-list');
  const filtered = filter === 'todos' ? interesses : interesses.filter(i => i.status === filter);
  if (!filtered.length) {
    list.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <p>Nenhum interesse encontrado para este filtro.</p>
        </div>`;
    return;
  }
  list.innerHTML = filtered.map(item => `
      <article class="interest-card ${item.status === 'novo' ? 'novo' : ''}" id="card-${item.id}">
        <div class="card-top">
          <div class="card-left">
            <div class="avatar ${item.av}">${item.avatar}</div>
            <div>
              <div class="user-name">${item.nome}</div>
              <div class="user-email">${item.email}</div>
            </div>
          </div>
          <span class="${item.status === 'novo' ? 'badge-novo' : 'badge-visto'}">
            ${item.status === 'novo' ? 'Novo' : 'Visto'}
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
            ${item.status === 'novo' ? `
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

function marcarVisto(id) {
  const item = interesses.find(i => i.id === id);
  if (item) item.status = 'visto';
  updateStats();
  renderCards(currentFilter);
}

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

/* Fechar modal clicando no overlay */
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

/* Filtros */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.dataset.filter;
    renderCards(currentFilter);
  });
});

/* Init */
updateStats();
renderCards('todos');
