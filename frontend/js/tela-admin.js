/* ════════════════════════════════════════════
   tela-admin.js — Amigo Fiel
   Conecta a tela admin com o banco via API REST
════════════════════════════════════════════ */

/* ── Usuário logado (salvo pelo login.js) ── */
const usuario = JSON.parse(localStorage.getItem('usuario'));

/* Redireciona se não estiver logado ou não for admin */
if (!usuario || usuario.tipo !== 'admin') {
  window.location.href = '/pages/login.html';
}

/* ── Avatares SVG de fallback (quando não há imagem_url) ── */
const FALLBACK_SVG = {
  cachorro: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="210" fill="#A8D8C8"/>
    <ellipse cx="150" cy="145" rx="80" ry="55" fill="#E8C87A"/>
    <rect x="108" y="168" width="20" height="40" rx="10" fill="#D4A852"/>
    <rect x="138" y="172" width="20" height="38" rx="10" fill="#D4A852"/>
    <rect x="168" y="172" width="20" height="36" rx="10" fill="#D4A852"/>
    <rect x="196" y="168" width="20" height="38" rx="10" fill="#D4A852"/>
    <ellipse cx="108" cy="110" rx="44" ry="40" fill="#E8C87A"/>
    <ellipse cx="93" cy="97" rx="15" ry="19" fill="#D4A852"/>
    <ellipse cx="122" cy="97" rx="15" ry="19" fill="#D4A852"/>
    <circle cx="99" cy="110" r="4" fill="#1A1A1A"/>
    <circle cx="116" cy="110" r="4" fill="#1A1A1A"/>
    <path d="M230 135 Q255 105 240 80" stroke="#E8C87A" stroke-width="14" fill="none" stroke-linecap="round"/>
  </svg>`,
  gato: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="210" fill="#E8E8F8"/>
    <ellipse cx="150" cy="150" rx="72" ry="52" fill="#888"/>
    <rect x="118" y="168" width="18" height="38" rx="9" fill="#777"/>
    <rect x="148" y="172" width="18" height="36" rx="9" fill="#777"/>
    <path d="M222 155 Q255 130 248 105 Q242 88 232 98" stroke="#777" stroke-width="14" fill="none" stroke-linecap="round"/>
    <ellipse cx="145" cy="100" rx="48" ry="44" fill="#888"/>
    <polygon points="112,82 100,54 128,72" fill="#888"/>
    <polygon points="178,82 190,54 162,72" fill="#888"/>
    <polygon points="114,80 104,58 128,72" fill="#F9C5C5"/>
    <polygon points="176,80 186,58 162,72" fill="#F9C5C5"/>
    <circle cx="135" cy="100" r="5" fill="#1A1A1A"/>
    <circle cx="155" cy="100" r="5" fill="#1A1A1A"/>
    <ellipse cx="145" cy="114" rx="8" ry="5" fill="#F9C5C5"/>
  </svg>`,
  outro: `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="210" fill="#F0E8D8"/>
    <text x="150" y="115" text-anchor="middle" font-size="72">🐾</text>
  </svg>`
};

/* ── Estado global ── */
let ANIMALS = [];

/* ════════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {

  /* Preenche nome do admin na tela */
  const nome = usuario.nome || 'Admin';
  document.getElementById('hero-admin-name').textContent = nome.split(' ')[0];
  document.getElementById('admin-name-header').textContent = nome.split(' ')[0];
  document.getElementById('admin-initial').textContent = nome.charAt(0).toUpperCase();

  /* Carrega animais do banco */
  await carregarAnimais();

  /* Scroll reveal */
  ativarReveal();
});

/* ════════════════════════════════════════════
   BUSCAR ANIMAIS DO BANCO (API)
════════════════════════════════════════════ */
async function carregarAnimais() {
  const grid = document.getElementById('admin-animals-grid');

  /* Skeleton de loading */
  grid.innerHTML = `
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
  `;

  try {
  // 🔥 GERA TOKEN NO FORMATO BASE64
const authToken = btoa(`${usuario.id}:${usuario.email}`);

  const resposta = await fetch('/api/admin/animais', {
    headers: {
      'Authorization': authToken,  // ← SEM "Bearer "
      'Content-Type': 'application/json'
    }
  });

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    const dados = await resposta.json();

    // Verifica se é array ou se tem a propriedade animais
   if (!Array.isArray(dados) && !dados.animais) {
   throw new Error('Erro ao buscar animais');
}

    ANIMALS = Array.isArray(dados) ? dados : (dados.animais || []);

    /* Atualiza stats */
    atualizarStats();

    /* Renderiza cards */
    renderCards();

  } catch (erro) {
    console.error('Erro ao carregar animais:', erro);
    grid.innerHTML = `
      <div class="error-state">
        <span style="font-size:2.5rem">😕</span>
        <p>Não foi possível carregar os animais.</p>
        <p style="font-size:.85rem;opacity:.7">${erro.message}</p>
        <button onclick="carregarAnimais()" style="margin-top:1rem;padding:.5rem 1.2rem;border-radius:8px;background:var(--green,#2d6a4f);color:#fff;border:none;cursor:pointer">
          Tentar novamente
        </button>
      </div>
    `;
  }
}

/* ════════════════════════════════════════════
   ATUALIZAR STATS DO HERO
════════════════════════════════════════════ */
function atualizarStats() {
  document.getElementById('stat-total').textContent = ANIMALS.length;
  document.getElementById('stat-ativos').textContent =
    ANIMALS.filter(a => a.status === 'disponivel').length;
}

/* ════════════════════════════════════════════
   RENDER CARDS
════════════════════════════════════════════ */
function renderCards() {
  const grid = document.getElementById('admin-animals-grid');
  grid.innerHTML = '';

  if (ANIMALS.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span style="font-size:3rem">🐾</span>
        <p>Você ainda não cadastrou nenhum animal.</p>
        <a href="/pages/cadastro-animal.html" style="margin-top:1rem;display:inline-block;padding:.6rem 1.4rem;border-radius:8px;background:var(--accent,#F4A035);color:#fff;text-decoration:none;font-weight:600">
          Cadastrar primeiro animal
        </a>
      </div>
    `;
    /* Adiciona card de novo animal mesmo com lista vazia */
    grid.appendChild(criarCardAdicionar());
    ativarReveal();
    return;
  }

  ANIMALS.forEach(animal => {
    grid.appendChild(criarCard(animal));
  });

  /* Card de adicionar novo */
  grid.appendChild(criarCardAdicionar());

  ativarReveal();
}

/* ── Cria um card de animal ── */
function criarCard(animal) {
  const disponivel = animal.status === 'disponivel';
  const statusClass = disponivel ? 'ativo' : 'inativo';
  const statusLabel = disponivel ? '✓ Disponível' : animal.status === 'adotado' ? '❤️ Adotado' : '⏸ Inativo';

  /* Imagem: usa imagem_url do banco, ou fallback SVG por espécie */
  const especieLower = (animal.especie || '').toLowerCase();
  const fallbackKey = especieLower.includes('gato') ? 'gato'
                    : especieLower.includes('cachorro') || especieLower.includes('cão') ? 'cachorro'
                    : 'outro';
  const labelEspecie = especieLower.includes('gato') ? '🐱 Gato'
                     : especieLower.includes('cachorro') || especieLower.includes('cão') ? '🐶 Cachorro'
                     : `🐾 ${animal.especie}`;

  const idadeTexto = animal.idade != null
    ? `${animal.idade} ano${animal.idade !== 1 ? 's' : ''}`
    : 'Idade não informada';

  const porteTexto = animal.porte
    ? `${animal.porte.charAt(0).toUpperCase() + animal.porte.slice(1)} porte`
    : '';

  const card = document.createElement('article');
  card.className = 'animal-card reveal';
  card.dataset.id = animal.id;

  card.innerHTML = `
    <div class="card-img-wrap">
      ${animal.imagem_url
        ? `<img src="${animal.imagem_url}" alt="${animal.nome}" class="card-image" onerror="this.parentElement.innerHTML='<div class=\\'card-svg-fallback\\'>${FALLBACK_SVG[fallbackKey].replace(/`/g, '\\`')}</div>'">`
        : `<div class="card-svg-fallback">${FALLBACK_SVG[fallbackKey]}</div>`
      }
      <span class="card-status ${statusClass}">${statusLabel}</span>
      <span class="card-species">${labelEspecie}</span>
    </div>
    <div class="card-body">
      <div class="card-name">${animal.nome}</div>
      <div class="card-meta">
        ${porteTexto ? `<span class="tag">${porteTexto}</span>` : ''}
        <span class="tag">${idadeTexto}</span>
      </div>
      <div class="card-actions">
        <a href="/pages/cadastro-animal.html?id=${animal.id}" class="card-btn-edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </a>
        <button class="card-btn-delete" onclick="confirmDelete(${animal.id}, '${animal.nome.replace(/'/g, "\\'")}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Remover
        </button>
      </div>
    </div>
  `;

  return card;
}

/* ── Cria o card "+" de adicionar novo animal ── */
function criarCardAdicionar() {
  const addCard = document.createElement('a');
  addCard.href = '/pages/cadastro-animal.html';
  addCard.className = 'card-add reveal';
  addCard.innerHTML = `
    <div class="card-add-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
    <span>Cadastrar novo animal</span>
  `;
  return addCard;
}

/* ════════════════════════════════════════════
   DELETAR ANIMAL
════════════════════════════════════════════ */
async function confirmDelete(id, nome) {
  if (!confirm(`Remover "${nome}" da plataforma?\nEsta ação não pode ser desfeita.`)) return;

  try {
  // 🔥 GERA TOKEN BASE64 NO NAVEGADOR
const authToken = btoa(`${usuario.id}:${usuario.email}`);

  const resposta = await fetch(`/api/admin/animais/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': authToken,  // ← SEM "Bearer "
      'Content-Type': 'application/json'
    }
  });

    const dados = await resposta.json();

    if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.erro || 'Erro ao remover animal');
}

    /* Remove do array local e atualiza a tela sem novo fetch */
    ANIMALS = ANIMALS.filter(a => a.id !== id);
    atualizarStats();
    renderCards();

    mostrarToast(`"${nome}" removido com sucesso!`, 'sucesso');

  } catch (erro) {
    console.error('Erro ao deletar:', erro);
    mostrarToast(`Erro ao remover: ${erro.message}`, 'erro');
  }
}

/* ════════════════════════════════════════════
   TOAST DE FEEDBACK
════════════════════════════════════════════ */
function mostrarToast(msg, tipo = 'sucesso') {
  /* Remove toast anterior se existir */
  document.querySelector('.admin-toast')?.remove();

  const toast = document.createElement('div');
  toast.className = `admin-toast admin-toast--${tipo}`;
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: .85rem 1.4rem;
    border-radius: 10px;
    background: ${tipo === 'sucesso' ? '#22c55e' : '#ef4444'};
    color: #fff;
    font-weight: 600;
    font-size: .9rem;
    box-shadow: 0 4px 20px rgba(0,0,0,.2);
    z-index: 9999;
    animation: slideInToast .3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
function ativarReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i % 4) * 0.08 + 's';
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════
   ANIMAÇÃO DO TOAST (CSS injetado via JS)
════════════════════════════════════════════ */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInToast {
    from { opacity: 0; transform: translateY(1rem); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-svg-fallback { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
  .card-svg-fallback svg { width:100%; height:100%; object-fit:cover; }
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
  .empty-state, .error-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem 1rem;
    color: #555;
  }
`;
document.head.appendChild(style);