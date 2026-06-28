/* ════════════════════════════════════════════
   favoritos.js — Amigo Fiel
   Lista os animais favoritados pelo usuário
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

function getAvatar(especie) {
  const e = (especie || '').toLowerCase();
  if (e.includes('cachorro') || e.includes('cão') || e.includes('cao')) return AVATARS_SVG.cachorro;
  if (e.includes('gato')) return AVATARS_SVG.gato;
  return AVATARS_SVG.outro;
}

/* ════════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  /* Redireciona se não estiver logado */
  if (!usuario.id) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('user-name-dropdown').textContent = usuario.nome || 'Usuário';
  document.getElementById('user-email-dropdown').textContent = usuario.email || '';

  await carregarFavoritos(usuario.id);
});

/* ════════════════════════════════════════════
   BUSCAR FAVORITOS DA API
════════════════════════════════════════════ */
async function carregarFavoritos(usuarioId) {
  const grid = document.getElementById('favoritos-grid');

  /* Skeleton enquanto carrega */
  grid.innerHTML = `
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
  `;

  try {
    const res = await fetch(`/api/favoritos/usuario/${usuarioId}`);
    if (!res.ok) throw new Error(`Erro ${res.status}`);

    const dados = await res.json();
    const favoritos = dados.favoritos || [];

    if (favoritos.length === 0) {
      grid.innerHTML = `
        <div class="empty-favoritos">
          <div class="empty-icon">🤍</div>
          <h3>Nenhum favorito ainda</h3>
          <p>Explore os animais disponíveis e salve os que você mais gostou.</p>
          <a href="home.html">Ver animais disponíveis</a>
        </div>`;
      return;
    }

    renderFavoritos(favoritos, usuarioId);

  } catch (erro) {
    console.error('Erro ao carregar favoritos:', erro);
    grid.innerHTML = `
      <div class="empty-favoritos">
        <div class="empty-icon">😕</div>
        <h3>Não foi possível carregar seus favoritos</h3>
        <p>${erro.message}</p>
        <a href="home.html">Voltar para o início</a>
      </div>`;
  }
}

/* ════════════════════════════════════════════
   RENDERIZAR CARDS DE FAVORITOS
════════════════════════════════════════════ */
function renderFavoritos(lista, usuarioId) {
  const grid = document.getElementById('favoritos-grid');

  grid.innerHTML = lista.map(animal => {
    const av = getAvatar(animal.especie);

    const imgHtml = animal.imagem_url
      ? `<img src="${animal.imagem_url}" alt="Foto de ${animal.nome}" style="width:100%;height:100%;object-fit:cover;" onerror="this.outerHTML='${av.svg.replace(/'/g, "\\'")}'">`
      : av.svg;

    const idadeTexto = animal.idade != null
      ? `${animal.idade} ano${animal.idade !== 1 ? 's' : ''}`
      : 'Idade não informada';

    const porteTexto = animal.porte ? `${animal.porte} porte` : '';
    const linkDetalhes = `detalhes-animal.html?id=${animal.animal_id}`;

    /* Status do animal — pode ter sido adotado desde que foi favoritado */
    const disponivel = (animal.status || 'disponivel') === 'disponivel';

    return `
      <article class="animal-card reveal" onclick="window.location.href='${linkDetalhes}'">
        <div class="card-img-wrap">
          ${imgHtml}
          <span class="card-badge">${disponivel ? '✓ Disponível' : '❤️ Adotado'}</span>
          <span class="card-species">${av.label}</span>

          <!-- Botão de remover favorito -->
          <button
            class="fav-btn favoritado"
            onclick="removerFavorito(event, ${animal.animal_id}, ${usuarioId})"
            title="Remover dos favoritos"
            aria-label="Remover dos favoritos"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
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
   REMOVER FAVORITO
════════════════════════════════════════════ */
async function removerFavorito(event, animalId, usuarioId) {
  /* Impede navegação para detalhes ao clicar no coração */
  event.stopPropagation();

  try {
    await fetch(`/api/favoritos/${usuarioId}/${animalId}`, { method: 'DELETE' });

    /* Remove o card da tela com animação suave */
    const card = event.currentTarget.closest('.animal-card');
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.remove();

      /* Se não sobrou nenhum card, mostra o estado vazio */
      const grid = document.getElementById('favoritos-grid');
      if (!grid.querySelector('.animal-card')) {
        grid.innerHTML = `
          <div class="empty-favoritos">
            <div class="empty-icon">🤍</div>
            <h3>Nenhum favorito ainda</h3>
            <p>Explore os animais disponíveis e salve os que você mais gostou.</p>
            <a href="home.html">Ver animais disponíveis</a>
          </div>`;
      }
    }, 300);

  } catch (e) {
    console.error('Erro ao remover favorito:', e.message);
  }
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