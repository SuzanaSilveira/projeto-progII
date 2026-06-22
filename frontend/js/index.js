/* ════════════════════════════════════════════
   index.js — Página pública (não logado)
   Amigo Fiel
════════════════════════════════════════════ */

async function carregarAnimais() {
    const grid = document.getElementById('animals-grid');

    /* ── Loading skeleton enquanto busca ── */
    grid.innerHTML = `
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>`;

    try {
        const resposta = await fetch('/api/animais/disponiveis');
        const dados = await resposta.json();

        grid.innerHTML = '';

        if (!dados.animais || dados.animais.length === 0) {
            grid.innerHTML = `
        <div class="empty-state">
          <p>Nenhum animal disponível no momento.</p>
        </div>`;
            return;
        }

        /* Exibe no máximo 4 cards na home pública */
        const preview = dados.animais.slice(0, 4);

        preview.forEach(animal => {
            const card = document.createElement('article');
            card.className = 'animal-card reveal';

            card.style.cursor = 'pointer';
            card.addEventListener('click', () => window.location.href = '/pages/login.html');

            card.innerHTML = `
        <div class="card-img-wrap">
          <img
            src="${animal.imagem_url}"
            alt="Foto de ${animal.nome}"
            class="card-img"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="card-img-fallback" style="display:none;">
            ${animal.especie === 'cachorro' ? fallbackCachorro() : fallbackGato()}
          </div>
          <span class="card-badge">✓ Disponível</span>
          <span class="card-species">
            ${animal.especie === 'cachorro' ? '🐶 Cachorro' : '🐱 Gato'}
          </span>
        </div>
        <div class="card-body">
          <div class="card-name">${animal.nome}</div>
          <div class="card-meta">
            <span class="tag">${animal.porte}</span>
            <span class="tag">${animal.idade}</span>
          </div>
          <a href="/pages/login.html" class="card-btn" onclick="event.stopPropagation()">
            Ver detalhes
          </a>
        </div>`;

            grid.appendChild(card);
        });

        /* Scroll reveal nos cards recém-inseridos */
        initScrollReveal();

    } catch (erro) {
        console.error('Erro ao carregar animais:', erro);
        grid.innerHTML = `
      <div class="empty-state">
        <p>Não foi possível carregar os animais. Tente novamente mais tarde.</p>
      </div>`;
    }
}

/* ── SVG fallback cachorro ── */
function fallbackCachorro() {
    return `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <rect width="300" height="210" fill="#A8D8C8"/>
    <ellipse cx="150" cy="145" rx="80" ry="55" fill="#E8C87A"/>
    <rect x="108" y="168" width="20" height="40" rx="10" fill="#D4A852"/>
    <rect x="138" y="172" width="20" height="38" rx="10" fill="#D4A852"/>
    <rect x="168" y="172" width="20" height="36" rx="10" fill="#D4A852"/>
    <rect x="196" y="168" width="20" height="38" rx="10" fill="#D4A852"/>
    <ellipse cx="108" cy="110" rx="44" ry="40" fill="#E8C87A"/>
    <ellipse cx="93"  cy="97"  rx="15" ry="19" fill="#D4A852"/>
    <ellipse cx="122" cy="97"  rx="15" ry="19" fill="#D4A852"/>
    <circle cx="99"  cy="110" r="4" fill="#1A1A1A"/>
    <circle cx="116" cy="110" r="4" fill="#1A1A1A"/>
    <ellipse cx="107" cy="130" rx="9" ry="6" fill="#C47A5A"/>
    <path d="M230 135 Q255 105 240 80" stroke="#E8C87A" stroke-width="14" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/* ── SVG fallback gato ── */
function fallbackGato() {
    return `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <rect width="300" height="210" fill="#E8E8F8"/>
    <ellipse cx="150" cy="150" rx="72" ry="52" fill="#888"/>
    <rect x="118" y="168" width="18" height="38" rx="9" fill="#777"/>
    <rect x="148" y="172" width="18" height="36" rx="9" fill="#777"/>
    <rect x="178" y="172" width="18" height="35" rx="9" fill="#777"/>
    <path d="M222 155 Q255 130 248 105 Q242 88 232 98" stroke="#777" stroke-width="14" fill="none" stroke-linecap="round"/>
    <ellipse cx="145" cy="100" rx="48" ry="44" fill="#888"/>
    <polygon points="112,82 100,54 128,72" fill="#888"/>
    <polygon points="178,82 190,54 162,72" fill="#888"/>
    <polygon points="114,80 104,58 128,72" fill="#F9C5C5"/>
    <polygon points="176,80 186,58 162,72" fill="#F9C5C5"/>
    <circle cx="135" cy="100" r="5" fill="#1A1A1A"/>
    <circle cx="155" cy="100" r="5" fill="#1A1A1A"/>
    <ellipse cx="145" cy="114" rx="8" ry="5" fill="#F9C5C5"/>
  </svg>`;
}

/* ── Scroll reveal ── */
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

/* ── Menu mobile ── */
document.addEventListener('DOMContentLoaded', () => {
    const ham = document.querySelector('.hamburger');
    const nav = document.querySelector('header nav');
    if (ham && nav) {
        ham.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('nav-open-mobile');
            nav.style.cssText = isOpen
                ? 'display:flex;flex-direction:column;position:fixed;top:74px;left:0;right:0;background:#FDFAF4;padding:1.4rem 5%;gap:1rem;border-bottom:1px solid rgba(0,0,0,.06);z-index:99;'
                : '';
        });
    }
});

document.addEventListener('DOMContentLoaded', carregarAnimais);