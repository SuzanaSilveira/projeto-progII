/* ════════════════════════════════════════════
   home.js — Amigo Fiel
   Busca animais da API e renderiza os cards
════════════════════════════════════════════ */

const AVATARS_SVG = {
  cachorro: {
    label: '🐶 Cachorro',
    svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#A8D8C8"/><ellipse cx="150" cy="145" rx="80" ry="55" fill="#E8C87A"/><rect x="108" y="168" width="20" height="40" rx="10" fill="#D4A852"/><rect x="138" y="172" width="20" height="38" rx="10" fill="#D4A852"/><rect x="168" y="172" width="20" height="36" rx="10" fill="#D4A852"/><rect x="196" y="168" width="20" height="38" rx="10" fill="#D4A852"/><ellipse cx="108" cy="110" rx="44" ry="40" fill="#E8C87A"/><ellipse cx="93" cy="97" rx="15" ry="19" fill="#D4A852"/><ellipse cx="122" cy="97" rx="15" ry="19" fill="#D4A852"/><ellipse cx="107" cy="123" rx="20" ry="13" fill="#D4A852"/><circle cx="99" cy="110" r="4" fill="#1A1A1A"/><circle cx="116" cy="110" r="4" fill="#1A1A1A"/><ellipse cx="107" cy="130" rx="9" ry="6" fill="#C47A5A"/><path d="M230 135 Q255 105 240 80" stroke="#E8C87A" stroke-width="14" fill="none" stroke-linecap="round"/></svg>`
  },
  gato: {
    label: '🐱 Gato',
    svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#E8E8F8"/><ellipse cx="150" cy="150" rx="72" ry="52" fill="#888"/><rect x="118" y="168" width="18" height="38" rx="9" fill="#777"/><rect x="148" y="172" width="18" height="36" rx="9" fill="#777"/><rect x="178" y="172" width="18" height="35" rx="9" fill="#777"/><path d="M222 155 Q255 130 248 105 Q242 88 232 98" stroke="#777" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="145" cy="100" rx="48" ry="44" fill="#888"/><polygon points="112,82 100,54 128,72" fill="#888"/><polygon points="178,82 190,54 162,72" fill="#888"/><polygon points="114,80 104,58 128,72" fill="#F9C5C5"/><polygon points="176,80 186,58 162,72" fill="#F9C5C5"/><circle cx="135" cy="100" r="5" fill="#1A1A1A"/><circle cx="155" cy="100" r="5" fill="#1A1A1A"/><ellipse cx="145" cy="114" rx="8" ry="5" fill="#F9C5C5"/></svg>`
  },
  outro: {
    label: '🐾 Animal',
    svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#F0E8D8"/><text x="150" y="120" text-anchor="middle" font-size="80">🐾</text></svg>`
  }
};

/* Detecta o avatar pelo campo especie vindo do banco */
function getAvatar(especie) {
  const e = (especie || '').toLowerCase();
  if (e.includes('cachorro') || e.includes('cão') || e.includes('cao')) return AVATARS_SVG.cachorro;
  if (e.includes('gato')) return AVATARS_SVG.gato;
  return AVATARS_SVG.outro;
}

/* Classifica idade em grupo para filtro */
function classificarIdade(idade) {
  if (!idade) return 'adulto';
  const n = parseFloat(String(idade));
  const str = String(idade).toLowerCase();
  if (str.includes('mes') || str.includes('mês') || n < 1) return 'filhote';
  if (n >= 8) return 'idoso';
  return 'adulto';
}

let ANIMALS = [];
let currentResults = [];

/* ════════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {

  /* Usuário logado */
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const nome = usuario.nome || 'Visitante';
  const email = usuario.email || '';

  document.getElementById('welcome-name').textContent = nome.split(' ')[0];
  document.getElementById('user-name-dropdown').textContent = nome;
  document.getElementById('user-email-dropdown').textContent = email;

  /* Carrega animais do banco */
  await carregarAnimais();

  initScrollReveal();
  setupSearchAndFilters();
});

/* ════════════════════════════════════════════
   BUSCAR ANIMAIS DA API
════════════════════════════════════════════ */
async function carregarAnimais() {
  const grid = document.getElementById('animals-grid');

  /* Skeleton enquanto carrega */
  grid.innerHTML = `
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
  `;

  try {
    const res = await fetch('/api/animais/disponiveis');
    if (!res.ok) throw new Error(`Erro ${res.status}`);

    const dados = await res.json();
    ANIMALS = dados.animais || [];

    /* Normaliza campo idadeGrupo para filtros */
    ANIMALS = ANIMALS.map(a => ({
      ...a,
      idadeGrupo: classificarIdade(a.idade)
    }));

    currentResults = [...ANIMALS];

    document.getElementById('stat-disponiveis').textContent = ANIMALS.length;
    document.getElementById('results-count-number').textContent = ANIMALS.length;

    renderAnimals(ANIMALS);

  } catch (erro) {
    console.error('Erro ao carregar animais:', erro);
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">😕</div>
        <h3>Não foi possível carregar os animais</h3>
        <p>${erro.message}</p>
        <button class="btn-reset" onclick="carregarAnimais()">Tentar novamente</button>
      </div>`;
  }
}

/* ════════════════════════════════════════════
   RENDERIZAÇÃO DOS CARDS
════════════════════════════════════════════ */
function renderAnimals(list) {
  const grid = document.getElementById('animals-grid');
  const countEl = document.getElementById('results-count-number');
  countEl.textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h3>Nenhum animal encontrado</h3>
        <p>Tente ajustar os filtros ou buscar por outro termo.</p>
        <button class="btn-reset" onclick="resetSearch()">Limpar busca e filtros</button>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(animal => {
    const av = getAvatar(animal.especie);

    /* Imagem: foto real do banco ou SVG de fallback */
    const imgHtml = animal.imagem_url
      ? `<img src="${animal.imagem_url}" alt="Foto de ${animal.nome}" style="width:100%;height:100%;object-fit:cover;" onerror="this.outerHTML='${av.svg.replace(/'/g, "\\'")}'">`
      : av.svg;

    const idadeTexto = animal.idade != null
      ? `${animal.idade} ano${animal.idade !== 1 ? 's' : ''}`
      : 'Idade não informada';

    const porteTexto = animal.porte
      ? `${animal.porte} porte`
      : '';

    /* Link com ?id= para a página de detalhes */
    const linkDetalhes = `detalhes-animal.html?id=${animal.id}`;

    return `
      <article class="animal-card reveal" onclick="window.location.href='${linkDetalhes}'">
        <div class="card-img-wrap">
          ${imgHtml}
          <span class="card-badge">✓ Disponível</span>
          <span class="card-species">${av.label}</span>
        </div>
        <div class="card-body">
          <div class="card-name">${animal.nome}</div>
          <div class="card-meta">
            ${porteTexto ? `<span class="tag">${porteTexto}</span>` : ''}
            <span class="tag">${idadeTexto}</span>
          </div>
          <a href="${linkDetalhes}" class="card-btn" onclick="event.stopPropagation()">Ver detalhes</a>
        </div>
      </article>`;
  }).join('');

  initScrollReveal();
}

/* ════════════════════════════════════════════
   BUSCA + FILTROS
════════════════════════════════════════════ */
function setupSearchAndFilters() {
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  const especieSel = document.getElementById('filter-especie');
  const porteSel = document.getElementById('filter-porte');
  const idadeSel = document.getElementById('filter-idade');
  const sortSel = document.getElementById('sort-select');
  const clearFiltersBtn = document.getElementById('btn-clear-filters');
  const searchForm = document.getElementById('search-form');

  function applyFilters() {
    const term = searchInput.value.trim().toLowerCase();
    const especie = especieSel.value;
    const porte = porteSel.value;
    const idade = idadeSel.value;

    let result = ANIMALS.filter(a => {
      const matchTerm = !term ||
        (a.nome || '').toLowerCase().includes(term) ||
        (a.especie || '').toLowerCase().includes(term) ||
        (a.raca || '').toLowerCase().includes(term);

      const matchEspecie = !especie ||
        (a.especie || '').toLowerCase().includes(especie.toLowerCase());
      const matchPorte = !porte ||
        (a.porte || '').toLowerCase() === porte.toLowerCase();
      const matchIdade = !idade || a.idadeGrupo === idade;

      return matchTerm && matchEspecie && matchPorte && matchIdade;
    });

    const sortVal = sortSel.value;
    if (sortVal === 'nome-az') result.sort((a, b) => a.nome.localeCompare(b.nome));
    if (sortVal === 'nome-za') result.sort((a, b) => b.nome.localeCompare(a.nome));

    currentResults = result;
    renderAnimals(result);

    clearSearchBtn.classList.toggle('show', term.length > 0);
    clearFiltersBtn.classList.toggle('show', !!(especie || porte || idade || term));
  }

  searchForm.addEventListener('submit', e => { e.preventDefault(); applyFilters(); });
  searchInput.addEventListener('input', applyFilters);
  especieSel.addEventListener('change', applyFilters);
  porteSel.addEventListener('change', applyFilters);
  idadeSel.addEventListener('change', applyFilters);
  sortSel.addEventListener('change', applyFilters);

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    applyFilters();
    searchInput.focus();
  });

  clearFiltersBtn.addEventListener('click', resetSearch);
}

function resetSearch() {
  document.getElementById('search-input').value = '';
  document.getElementById('filter-especie').value = '';
  document.getElementById('filter-porte').value = '';
  document.getElementById('filter-idade').value = '';
  document.getElementById('sort-select').value = '';
  currentResults = [...ANIMALS];
  renderAnimals(currentResults);
  document.getElementById('btn-clear-search').classList.remove('show');
  document.getElementById('btn-clear-filters').classList.remove('show');
}

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i % 4) * 0.08 + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════
   LOGOUT
════════════════════════════════════════════ */
function logout() {
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

/* ════════════════════════════════════════════
   MENU MOBILE
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.querySelector('.hamburger');
  const nav = document.querySelector('header nav');
  if (!ham || !nav) return;
  ham.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open-mobile');
    nav.style.cssText = isOpen
      ? 'display:flex;flex-direction:column;position:fixed;top:74px;left:0;right:0;background:var(--warm-white);padding:1.4rem 5%;gap:1rem;border-bottom:1px solid rgba(0,0,0,.06);z-index:99;'
      : '';
  });
});

/* ── Skeleton CSS injetado ── */
const skeletonStyle = document.createElement('style');
skeletonStyle.textContent = `
  .card-skeleton {
    height: 320px;
    border-radius: 16px;
    background: linear-gradient(90deg, #e2e8e4 25%, #f0f4f1 50%, #e2e8e4 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
document.head.appendChild(skeletonStyle);