
/* ════════════════════════════════════════════
   DADOS SIMULADOS
   (substitua por fetch('/api/animais') quando o backend estiver pronto)
════════════════════════════════════════════ */
const AVATARS_SVG = {
  cachorro1: { bg: '#A8D8C8', label: '🐶 Cachorro', svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#A8D8C8"/><ellipse cx="150" cy="145" rx="80" ry="55" fill="#E8C87A"/><rect x="108" y="168" width="20" height="40" rx="10" fill="#D4A852"/><rect x="138" y="172" width="20" height="38" rx="10" fill="#D4A852"/><rect x="168" y="172" width="20" height="36" rx="10" fill="#D4A852"/><rect x="196" y="168" width="20" height="38" rx="10" fill="#D4A852"/><ellipse cx="108" cy="110" rx="44" ry="40" fill="#E8C87A"/><ellipse cx="93" cy="97" rx="15" ry="19" fill="#D4A852"/><ellipse cx="122" cy="97" rx="15" ry="19" fill="#D4A852"/><circle cx="99" cy="110" r="4" fill="#1A1A1A"/><circle cx="116" cy="110" r="4" fill="#1A1A1A"/><path d="M230 135 Q255 105 240 80" stroke="#E8C87A" stroke-width="14" fill="none" stroke-linecap="round"/></svg>` },
  cachorro2: { bg: '#D4E8F0', label: '🐶 Cachorro', svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#D4E8F0"/><ellipse cx="155" cy="140" rx="95" ry="58" fill="#C8A882"/><rect x="104" y="163" width="22" height="45" rx="11" fill="#B8946C"/><rect x="136" y="168" width="22" height="42" rx="11" fill="#B8946C"/><ellipse cx="100" cy="98" rx="50" ry="45" fill="#C8A882"/><ellipse cx="83" cy="84" rx="17" ry="22" fill="#B8946C"/><ellipse cx="117" cy="84" rx="17" ry="22" fill="#B8946C"/><circle cx="91" cy="100" r="5" fill="#1A1A1A"/><circle cx="110" cy="100" r="5" fill="#1A1A1A"/><ellipse cx="185" cy="128" rx="25" ry="18" fill="rgba(0,0,0,.12)"/><path d="M250 120 Q270 95 255 72" stroke="#C8A882" stroke-width="16" fill="none" stroke-linecap="round"/></svg>` },
  gato1: { bg: '#E8E8F8', label: '🐱 Gato', svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#E8E8F8"/><ellipse cx="150" cy="150" rx="72" ry="52" fill="#888"/><rect x="118" y="168" width="18" height="38" rx="9" fill="#777"/><rect x="148" y="172" width="18" height="36" rx="9" fill="#777"/><path d="M222 155 Q255 130 248 105 Q242 88 232 98" stroke="#777" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="145" cy="100" rx="48" ry="44" fill="#888"/><polygon points="112,82 100,54 128,72" fill="#888"/><polygon points="178,82 190,54 162,72" fill="#888"/><polygon points="114,80 104,58 128,72" fill="#F9C5C5"/><polygon points="176,80 186,58 162,72" fill="#F9C5C5"/><circle cx="135" cy="100" r="5" fill="#1A1A1A"/><circle cx="155" cy="100" r="5" fill="#1A1A1A"/><ellipse cx="145" cy="114" rx="8" ry="5" fill="#F9C5C5"/></svg>` },
  gato2: { bg: '#F0E8F8', label: '🐱 Gato', svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#F0E8F8"/><ellipse cx="150" cy="148" rx="68" ry="50" fill="#F4A035"/><rect x="120" y="165" width="18" height="40" rx="9" fill="#E8943A"/><rect x="150" y="170" width="18" height="37" rx="9" fill="#E8943A"/><path d="M218 150 Q248 125 240 100 Q234 85 225 95" stroke="#F4A035" stroke-width="13" fill="none" stroke-linecap="round"/><ellipse cx="148" cy="100" rx="46" ry="42" fill="#F4A035"/><polygon points="115,82 103,55 130,72" fill="#F4A035"/><polygon points="180,82 192,55 165,72" fill="#F4A035"/><polygon points="117,80 107,58 130,72" fill="#F9C5C5"/><polygon points="178,80 188,58 165,72" fill="#F9C5C5"/><circle cx="137" cy="98" r="5" fill="#2D3748"/><circle cx="158" cy="98" r="5" fill="#2D3748"/><ellipse cx="147" cy="112" rx="8" ry="5" fill="#E86B3A"/></svg>` }
};

/* Dados fictícios — virão do banco via backend */
const ANIMALS = [
  { id: 1, nome: 'Bolinha', especie: 'cachorro', porte: 'Pequeno', idade: '2 anos', imagem: 'cachorro1', ativo: true },
  { id: 2, nome: 'Luna', especie: 'gato', porte: 'Médio', idade: '1 ano', imagem: 'gato1', ativo: true },
  { id: 3, nome: 'Thor', especie: 'cachorro', porte: 'Grande', idade: '3 anos', imagem: 'cachorro2', ativo: true },
  { id: 4, nome: 'Mel', especie: 'gato', porte: 'Pequeno', idade: '4 meses', imagem: 'gato2', ativo: false },
];

/* ════════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Nome do admin (virá da sessão/backend) */
  const adminName = 'Admin';
  document.getElementById('hero-admin-name').textContent = adminName;
  document.getElementById('admin-name-header').textContent = adminName;
  document.getElementById('admin-initial').textContent = adminName.charAt(0).toUpperCase();

  /* Stats */
  document.getElementById('stat-total').textContent = ANIMALS.length;
  document.getElementById('stat-ativos').textContent = ANIMALS.filter(a => a.ativo).length;

  /* Renderiza cards */
  renderCards();

  /* Scroll reveal */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i % 4) * 0.08 + 's';
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});

/* ════════════════════════════════════════════
   RENDER CARDS
════════════════════════════════════════════ */
function renderCards() {
  const grid = document.getElementById('admin-animals-grid');
  grid.innerHTML = '';

  ANIMALS.forEach(animal => {
    const av = AVATARS_SVG[animal.imagem];
    const statusClass = animal.ativo ? 'ativo' : 'inativo';
    const statusLabel = animal.ativo ? '✓ Ativo' : '● Inativo';

    const card = document.createElement('article');
    card.className = 'animal-card reveal';
    card.innerHTML = `
      <div class="card-img-wrap">
        ${av.svg}
        <span class="card-status ${statusClass}">${statusLabel}</span>
        <span class="card-species">${av.label}</span>
      </div>
      <div class="card-body">
        <div class="card-name">${animal.nome}</div>
        <div class="card-meta">
          <span class="tag">${animal.porte} porte</span>
          <span class="tag">${animal.idade}</span>
        </div>
        <div class="card-actions">
          <a href="pages/cadastro-animal.html" class="card-btn-edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </a>
          <button class="card-btn-delete" onclick="confirmDelete(${animal.id}, '${animal.nome}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Remover
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  /* card de adicionar novo */
  const addCard = document.createElement('a');
  addCard.href = 'pages/cadastro-animal.html';
  addCard.className = 'card-add reveal';
  addCard.innerHTML = `
    <div class="card-add-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </div>
    <span>Cadastrar novo animal</span>`;
  grid.appendChild(addCard);

  /* reativa o reveal nos novos cards */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i % 4) * 0.08 + 's';
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('#admin-animals-grid .reveal').forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════
   DELETAR (simulado — integrar com backend)
════════════════════════════════════════════ */
function confirmDelete(id, nome) {
  if (!confirm(`Remover "${nome}" da plataforma? Esta ação não pode ser desfeita.`)) return;

  /*
  ── INTEGRAÇÃO COM BACKEND ──
  const res = await fetch(`/api/animais/${id}`, { method: 'DELETE' });
  if (res.ok) { ... }
  ────────────────────────── */

  const idx = ANIMALS.findIndex(a => a.id === id);
  if (idx !== -1) ANIMALS.splice(idx, 1);

  document.getElementById('stat-total').textContent = ANIMALS.length;
  document.getElementById('stat-ativos').textContent = ANIMALS.filter(a => a.ativo).length;
  renderCards();
}