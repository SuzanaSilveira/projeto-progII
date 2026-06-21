/* ════════════════════════════════════════════
   home.js — Lógica da tela inicial do usuário
   Amigo Fiel
════════════════════════════════════════════ */

/* ── SVGs reutilizados (mesmos avatares do cadastro de animais) ── */
const AVATARS_SVG = {
  cachorro1: {
    label: '🐶 Cachorro',
    svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#A8D8C8"/><ellipse cx="150" cy="145" rx="80" ry="55" fill="#E8C87A"/><rect x="108" y="168" width="20" height="40" rx="10" fill="#D4A852"/><rect x="138" y="172" width="20" height="38" rx="10" fill="#D4A852"/><rect x="168" y="172" width="20" height="36" rx="10" fill="#D4A852"/><rect x="196" y="168" width="20" height="38" rx="10" fill="#D4A852"/><ellipse cx="108" cy="110" rx="44" ry="40" fill="#E8C87A"/><ellipse cx="93" cy="97" rx="15" ry="19" fill="#D4A852"/><ellipse cx="122" cy="97" rx="15" ry="19" fill="#D4A852"/><ellipse cx="107" cy="123" rx="20" ry="13" fill="#D4A852"/><circle cx="99" cy="110" r="4" fill="#1A1A1A"/><circle cx="116" cy="110" r="4" fill="#1A1A1A"/><ellipse cx="107" cy="130" rx="9" ry="6" fill="#C47A5A"/><path d="M230 135 Q255 105 240 80" stroke="#E8C87A" stroke-width="14" fill="none" stroke-linecap="round"/></svg>`
  },
  cachorro2: {
    label: '🐶 Cachorro',
    svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#D4E8F0"/><ellipse cx="155" cy="140" rx="95" ry="58" fill="#C8A882"/><rect x="104" y="163" width="22" height="45" rx="11" fill="#B8946C"/><rect x="136" y="168" width="22" height="42" rx="11" fill="#B8946C"/><rect x="170" y="168" width="22" height="42" rx="11" fill="#B8946C"/><rect x="202" y="163" width="22" height="45" rx="11" fill="#B8946C"/><ellipse cx="100" cy="98" rx="50" ry="45" fill="#C8A882"/><ellipse cx="83" cy="84" rx="17" ry="22" fill="#B8946C"/><ellipse cx="117" cy="84" rx="17" ry="22" fill="#B8946C"/><circle cx="91" cy="100" r="5" fill="#1A1A1A"/><circle cx="110" cy="100" r="5" fill="#1A1A1A"/><ellipse cx="185" cy="128" rx="25" ry="18" fill="rgba(0,0,0,.12)"/><path d="M250 120 Q270 95 255 72" stroke="#C8A882" stroke-width="16" fill="none" stroke-linecap="round"/></svg>`
  },
  gato1: {
    label: '🐱 Gato',
    svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#E8E8F8"/><ellipse cx="150" cy="150" rx="72" ry="52" fill="#888"/><rect x="118" y="168" width="18" height="38" rx="9" fill="#777"/><rect x="148" y="172" width="18" height="36" rx="9" fill="#777"/><rect x="178" y="172" width="18" height="35" rx="9" fill="#777"/><path d="M222 155 Q255 130 248 105 Q242 88 232 98" stroke="#777" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="145" cy="100" rx="48" ry="44" fill="#888"/><polygon points="112,82 100,54 128,72" fill="#888"/><polygon points="178,82 190,54 162,72" fill="#888"/><polygon points="114,80 104,58 128,72" fill="#F9C5C5"/><polygon points="176,80 186,58 162,72" fill="#F9C5C5"/><circle cx="135" cy="100" r="5" fill="#1A1A1A"/><circle cx="155" cy="100" r="5" fill="#1A1A1A"/><ellipse cx="145" cy="114" rx="8" ry="5" fill="#F9C5C5"/></svg>`
  },
  gato2: {
    label: '🐱 Gato',
    svg: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="210" fill="#F0E8F8"/><ellipse cx="150" cy="148" rx="68" ry="50" fill="#F4A035"/><rect x="120" y="165" width="18" height="40" rx="9" fill="#E8943A"/><rect x="150" y="170" width="18" height="37" rx="9" fill="#E8943A"/><rect x="178" y="170" width="18" height="37" rx="9" fill="#E8943A"/><path d="M218 150 Q248 125 240 100 Q234 85 225 95" stroke="#F4A035" stroke-width="13" fill="none" stroke-linecap="round"/><ellipse cx="148" cy="100" rx="46" ry="42" fill="#F4A035"/><polygon points="115,82 103,55 130,72" fill="#F4A035"/><polygon points="180,82 192,55 165,72" fill="#F4A035"/><polygon points="117,80 107,58 130,72" fill="#F9C5C5"/><polygon points="178,80 188,58 165,72" fill="#F9C5C5"/><circle cx="137" cy="98" r="5" fill="#2D3748"/><circle cx="158" cy="98" r="5" fill="#2D3748"/><ellipse cx="147" cy="112" rx="8" ry="5" fill="#E86B3A"/></svg>`
  }
};

/* ── Dados simulados (substituir por fetch('/api/animais') do backend) ── */
const ANIMALS = [
  { id: 1, nome: 'Bolinha', especie: 'cachorro', raca: 'SRD', porte: 'Pequeno', idade: '2 anos', idadeGrupo: 'adulto', imagem: 'cachorro1', descricao: 'Dócil e brincalhão, adora um carinho.' },
  { id: 2, nome: 'Luna', especie: 'gato', raca: 'SRD', porte: 'Médio', idade: '1 ano', idadeGrupo: 'adulto', imagem: 'gato1', descricao: 'Independente, mas carinhosa com quem confia.' },
  { id: 3, nome: 'Thor', especie: 'cachorro', raca: 'SRD', porte: 'Grande', idade: '3 anos', idadeGrupo: 'adulto', imagem: 'cachorro2', descricao: 'Protetor e leal, ótimo com crianças.' },
  { id: 4, nome: 'Mel', especie: 'gato', raca: 'SRD', porte: 'Pequeno', idade: '4 meses', idadeGrupo: 'filhote', imagem: 'gato2', descricao: 'Cheia de energia, ama brincar o dia todo.' },
  { id: 5, nome: 'Pipoca', especie: 'cachorro', raca: 'SRD', porte: 'Médio', idade: '4 anos', idadeGrupo: 'adulto', imagem: 'cachorro1', descricao: 'Calma e companheira, ideal para apartamento.' },
  { id: 6, nome: 'Fumaça', especie: 'gato', raca: 'SRD', porte: 'Grande', idade: '7 anos', idadeGrupo: 'idoso', imagem: 'gato1', descricao: 'Tranquilo, gosta de um cantinho ao sol.' },
  { id: 7, nome: 'Biscoito', especie: 'cachorro', raca: 'SRD', porte: 'Pequeno', idade: '3 meses', idadeGrupo: 'filhote', imagem: 'cachorro2', descricao: 'Filhote curioso, está aprendendo tudo.' },
  { id: 8, nome: 'Pêssego', especie: 'gato', raca: 'SRD', porte: 'Médio', idade: '2 anos', idadeGrupo: 'adulto', imagem: 'gato2', descricao: 'Adora colo e ronrona o tempo todo.' },
];

let currentResults = [...ANIMALS];

/* ════════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Nome do usuário logado ──
     Substituir pela leitura real da sessão/token do backend.
     Ex: const userName = sessionStorage.getItem('userName') || 'Visitante'; */
  const userName = getLoggedUserName();

  document.getElementById('welcome-name').textContent = userName;
  document.getElementById('user-name-dropdown').textContent = userName;
  document.getElementById('user-email-dropdown').textContent = getLoggedUserEmail();

  /* Stats */
  document.getElementById('stat-disponiveis').textContent = ANIMALS.length;

  /* Render inicial */
  renderAnimals(currentResults);

  /* Scroll reveal */
  initScrollReveal();

  /* Eventos de busca e filtro */
  setupSearchAndFilters();
});

/* ════════════════════════════════════════════
   SESSÃO (placeholder até integrar backend)
════════════════════════════════════════════ */
function getLoggedUserName() {
  // return sessionStorage.getItem('userName') || 'Visitante';
  return 'Larissa';
}
function getLoggedUserEmail() {
  // return sessionStorage.getItem('userEmail') || '';
  return 'larissa@email.com';
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
    const av = AVATARS_SVG[animal.imagem];
    return `
      <article class="animal-card reveal" onclick="window.location.href='pages/detalhes-animal.html'">
        <div class="card-img-wrap">
          ${av.svg}
          <span class="card-badge">✓ Disponível</span>
          <span class="card-species">${av.label}</span>
        </div>
        <div class="card-body">
          <div class="card-name">${animal.nome}</div>
          <div class="card-meta">
            <span class="tag">${animal.porte} porte</span>
            <span class="tag">${animal.idade}</span>
          </div>
          <a href="pages/detalhes-animal.html" class="card-btn" onclick="event.stopPropagation()">Ver detalhes</a>
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
        a.nome.toLowerCase().includes(term) ||
        a.especie.toLowerCase().includes(term) ||
        a.raca.toLowerCase().includes(term) ||
        a.idade.toLowerCase().includes(term);

      const matchEspecie = !especie || a.especie === especie;
      const matchPorte = !porte || a.porte === porte;
      const matchIdade = !idade || a.idadeGrupo === idade;

      return matchTerm && matchEspecie && matchPorte && matchIdade;
    });

    // ordenação
    const sortVal = sortSel.value;
    if (sortVal === 'nome-az') result.sort((a, b) => a.nome.localeCompare(b.nome));
    if (sortVal === 'nome-za') result.sort((a, b) => b.nome.localeCompare(a.nome));

    currentResults = result;
    renderAnimals(result);

    // toggle de botões auxiliares
    clearSearchBtn.classList.toggle('show', term.length > 0);
    const hasActiveFilters = especie || porte || idade || term;
    clearFiltersBtn.classList.toggle('show', !!hasActiveFilters);
  }

  searchForm.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(); });
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
  /*
  ── INTEGRAÇÃO COM BACKEND ──
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('token');
  ──────────────────────────── */
  window.location.href = 'index.html';
}

/* ════════════════════════════════════════════
   MENU MOBILE (hambúrguer simples)
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.querySelector('.hamburger');
  const nav = document.querySelector('header nav');
  if (!ham || !nav) return;

  ham.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open-mobile');
    if (isOpen) {
      nav.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:74px;left:0;right:0;background:var(--warm-white);padding:1.4rem 5%;gap:1rem;border-bottom:1px solid rgba(0,0,0,.06);z-index:99;';
    } else {
      nav.style.cssText = '';
    }
  });
});