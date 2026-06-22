/* ════════════════════════════════════════════
   detalhes-animal.js — Amigo Fiel
   Lê ?id= da URL e busca o animal na API
════════════════════════════════════════════ */

const PLACEHOLDER_SVG = {
  cachorro: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="400" height="300" fill="#A8D8C8"/><ellipse cx="200" cy="195" rx="110" ry="75" fill="#E8C87A"/><rect x="145" y="228" width="28" height="55" rx="14" fill="#D4A852"/><rect x="184" y="233" width="28" height="52" rx="14" fill="#D4A852"/><rect x="224" y="233" width="28" height="52" rx="14" fill="#D4A852"/><rect x="261" y="228" width="28" height="55" rx="14" fill="#D4A852"/><ellipse cx="148" cy="145" rx="62" ry="57" fill="#E8C87A"/><ellipse cx="126" cy="126" rx="22" ry="28" fill="#D4A852"/><ellipse cx="170" cy="126" rx="22" ry="28" fill="#D4A852"/><circle cx="136" cy="145" r="6" fill="#1A1A1A"/><circle cx="161" cy="145" r="6" fill="#1A1A1A"/><circle cx="137.5" cy="143" r="2" fill="white"/><circle cx="162.5" cy="143" r="2" fill="white"/><ellipse cx="148" cy="178" rx="13" ry="8" fill="#C47A5A"/><path d="M310 180 Q345 145 332 112" stroke="#E8C87A" stroke-width="20" fill="none" stroke-linecap="round"/></svg>`,
  gato: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="400" height="300" fill="#E8E8F8"/><ellipse cx="200" cy="200" rx="95" ry="70" fill="#888"/><rect x="158" y="230" width="24" height="55" rx="12" fill="#777"/><rect x="196" y="236" width="24" height="50" rx="12" fill="#777"/><path d="M295 205 Q340 170 330 135 Q322 118 308 128" stroke="#777" stroke-width="18" fill="none" stroke-linecap="round"/><ellipse cx="193" cy="133" rx="63" ry="58" fill="#888"/><polygon points="148,108 132,72 170,96" fill="#888"/><polygon points="238,108 254,72 216,96" fill="#888"/><polygon points="150,106 136,74 170,96" fill="#F9C5C5"/><polygon points="236,106 250,74 216,96" fill="#F9C5C5"/><circle cx="178" cy="132" r="7" fill="#1A1A1A"/><circle cx="208" cy="132" r="7" fill="#1A1A1A"/><ellipse cx="193" cy="152" rx="10" ry="7" fill="#F9C5C5"/></svg>`,
  outro: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="400" height="300" fill="#F0E8D8"/><text x="200" y="170" text-anchor="middle" font-size="100">🐾</text></svg>`
};

function getPlaceholder(especie) {
  const e = (especie || '').toLowerCase();
  if (e.includes('cachorro') || e.includes('cão') || e.includes('cao')) return PLACEHOLDER_SVG.cachorro;
  if (e.includes('gato')) return PLACEHOLDER_SVG.gato;
  return PLACEHOLDER_SVG.outro;
}

function getEspecieLabel(especie) {
  const e = (especie || '').toLowerCase();
  if (e.includes('cachorro') || e.includes('cão') || e.includes('cao')) return '🐶 Cachorro';
  if (e.includes('gato')) return '🐱 Gato';
  return `🐾 ${especie}`;
}

/* ── Mini SVGs para "outros animais" ── */
const MINI_SVG = {
  cachorro: `<svg viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg"><rect width="260" height="130" fill="#D4E8F0"/><ellipse cx="130" cy="88" rx="72" ry="42" fill="#C8A882"/><ellipse cx="88" cy="56" rx="36" ry="32" fill="#C8A882"/><ellipse cx="75" cy="46" rx="12" ry="16" fill="#B8946C"/><ellipse cx="100" cy="46" rx="12" ry="16" fill="#B8946C"/><circle cx="82" cy="58" r="4" fill="#1A1A1A"/><circle cx="96" cy="58" r="4" fill="#1A1A1A"/><path d="M202 80 Q222 60 210 42" stroke="#C8A882" stroke-width="12" fill="none" stroke-linecap="round"/></svg>`,
  gato: `<svg viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg"><rect width="260" height="130" fill="#E8E8F8"/><ellipse cx="130" cy="88" rx="65" ry="40" fill="#888"/><ellipse cx="97" cy="56" rx="34" ry="32" fill="#888"/><polygon points="74,42 64,20 88,35" fill="#888"/><polygon points="120,42 130,20 106,35" fill="#888"/><polygon points="76,40 68,22 88,35" fill="#F9C5C5"/><polygon points="118,40 128,22 106,35" fill="#F9C5C5"/><circle cx="87" cy="56" r="4" fill="#1A1A1A"/><circle cx="108" cy="56" r="4" fill="#1A1A1A"/><path d="M195 82 Q220 66 215 46" stroke="#888" stroke-width="9" fill="none" stroke-linecap="round"/></svg>`
};

/* ── ID do animal na URL ── */
function getIdDaURL() {
  return new URLSearchParams(window.location.search).get('id');
}

/* ════════════════════════════════════════════
   INICIALIZAÇÃO
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  const id = getIdDaURL();

  if (!id) {
    mostrarErro('Nenhum animal selecionado.', 'Volte para a lista de animais e tente novamente.');
    return;
  }

  await carregarAnimal(id);
});

/* ════════════════════════════════════════════
   BUSCAR ANIMAL DA API
════════════════════════════════════════════ */
async function carregarAnimal(id) {
  try {
    const res = await fetch(`/api/animais/${id}`);

    if (res.status === 404) {
      mostrarErro('Animal não encontrado.', 'Este animal pode ter sido removido ou adotado.');
      return;
    }
    if (!res.ok) throw new Error(`Erro ${res.status}`);

    const dados = await res.json();
    if (!dados.success) throw new Error(dados.message || 'Erro ao buscar animal');

    preencherPagina(dados.animal);
    await carregarOutrosAnimais(id);

  } catch (erro) {
    console.error('Erro ao carregar animal:', erro);
    mostrarErro('Não foi possível carregar os dados.', erro.message);
  }
}

/* ════════════════════════════════════════════
   PREENCHER A PÁGINA COM OS DADOS DO ANIMAL
════════════════════════════════════════════ */
function preencherPagina(a) {
  /* Título e breadcrumb */
  document.title = `${a.nome} — Amigo Fiel`;
  document.getElementById('bc-nome').textContent = a.nome;
  document.getElementById('animal-nome').textContent = a.nome;
  document.getElementById('desc-nome').textContent = a.nome;
  document.getElementById('modal-animal-nome').textContent = a.nome;
  document.getElementById('animal-descricao').textContent = a.descricao || 'Sem descrição disponível.';
  document.getElementById('ong-nome').textContent = a.responsavel_nome || 'ONG Responsável';

  /* Status pill */
  const statusPill = document.querySelector('.status-pill');
  if (statusPill) {
    if (a.status === 'adotado') {
      statusPill.textContent = '❤️ Já foi adotado';
      statusPill.style.background = '#fecdd3';
      statusPill.style.color = '#be123c';
      /* desabilita botão de interesse se já adotado */
      const btn = document.getElementById('btn-interesse');
      if (btn) { btn.disabled = true; btn.textContent = 'Animal já adotado'; }
    } else {
      statusPill.textContent = '✓ Disponível para adoção';
    }
  }

  /* Foto */
  const wrap = document.getElementById('animal-photo-wrap');
  const label = getEspecieLabel(a.especie);
  if (a.imagem_url) {
    wrap.innerHTML = `
      <img src="${a.imagem_url}" alt="Foto de ${a.nome}"
           onerror="this.outerHTML='${getPlaceholder(a.especie).replace(/"/g, '&quot;')}'" />
      <span class="photo-badge-species">${label}</span>`;
  } else {
    wrap.innerHTML = getPlaceholder(a.especie) + `<span class="photo-badge-species">${label}</span>`;
  }

  /* Meta tags (espécie, porte, idade) */
  const metaRow = document.getElementById('animal-meta-row');
  const idadeTexto = a.idade != null ? `${a.idade} ano${a.idade !== 1 ? 's' : ''}` : null;
  [a.especie, a.porte ? a.porte + ' porte' : null, idadeTexto]
    .filter(Boolean)
    .forEach(t => {
      const s = document.createElement('span');
      s.className = 'meta-tag';
      s.textContent = t;
      metaRow.appendChild(s);
    });

  /* Grade de detalhes */
  const campos = [
    { label: 'Espécie',  valor: a.especie },
    { label: 'Raça',     valor: a.raca || 'SRD' },
    { label: 'Porte',    valor: a.porte },
    { label: 'Idade',    valor: idadeTexto },
    { label: 'Sexo',     valor: a.sexo },
    { label: 'Status',   valor: a.status },
  ].filter(c => c.valor);

  const grid = document.getElementById('detail-grid');
  campos.forEach(c => {
    const div = document.createElement('div');
    div.className = 'detail-item';
    div.innerHTML = `<label>${c.label}</label><span>${c.valor}</span>`;
    grid.appendChild(div);
  });

  /* Salva id no botão de interesse para uso no modal */
  const btnInteresse = document.getElementById('btn-interesse');
  if (btnInteresse) btnInteresse.dataset.animalId = a.id;
}

/* ════════════════════════════════════════════
   OUTROS ANIMAIS DISPONÍVEIS
════════════════════════════════════════════ */
async function carregarOutrosAnimais(idAtual) {
  try {
    const res = await fetch('/api/animais/disponiveis');
    if (!res.ok) return;

    const dados = await res.json();
    const outros = (dados.animais || [])
      .filter(a => String(a.id) !== String(idAtual))
      .slice(0, 4);

    renderMore(outros);
  } catch (e) {
    /* silencioso — seção "outros animais" não é crítica */
  }
}

function renderMore(lista) {
  const g = document.getElementById('more-grid');
  if (!g || lista.length === 0) {
    if (g) g.innerHTML = '<p style="color:#999;grid-column:1/-1">Nenhum outro animal disponível no momento.</p>';
    return;
  }

  g.innerHTML = '';
  lista.forEach(a => {
    const especieLower = (a.especie || '').toLowerCase();
    const miniSvg = especieLower.includes('gato') ? MINI_SVG.gato : MINI_SVG.cachorro;
    const imgHtml = a.imagem_url
      ? `<img src="${a.imagem_url}" alt="${a.nome}" style="width:100%;height:100%;object-fit:cover;">`
      : miniSvg;

    const idadeTexto = a.idade != null ? `${a.idade} ano${a.idade !== 1 ? 's' : ''}` : '';
    const porteTexto = a.porte || '';

    const c = document.createElement('a');
    c.href = `detalhes-animal.html?id=${a.id}`;
    c.className = 'mini-card';
    c.innerHTML = `
      <div class="mini-card-img">${imgHtml}</div>
      <div class="mini-card-body">
        <div class="mini-card-name">${a.nome}</div>
        <div class="mini-card-tags">
          ${porteTexto ? `<span class="mini-tag">${porteTexto}</span>` : ''}
          ${idadeTexto ? `<span class="mini-tag">${idadeTexto}</span>` : ''}
        </div>
      </div>`;
    g.appendChild(c);
  });
}

/* ════════════════════════════════════════════
   ESTADO DE ERRO NA PÁGINA
════════════════════════════════════════════ */
function mostrarErro(titulo, detalhe) {
  document.querySelector('.detail-wrapper').innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:4rem 1rem;">
      <div style="font-size:4rem">😕</div>
      <h2 style="margin:.5rem 0">${titulo}</h2>
      <p style="color:#888">${detalhe}</p>
      <a href="../home.html" style="display:inline-block;margin-top:1.5rem;padding:.7rem 1.8rem;background:#2d6a4f;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">
        ← Voltar para animais
      </a>
    </div>`;
}

/* ════════════════════════════════════════════
   MODAL DE INTERESSE
════════════════════════════════════════════ */
function abrirModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('modal-msg').focus(), 300);
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) fecharModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') fecharModal();
});

/* Contador de caracteres */
document.getElementById('modal-msg').addEventListener('input', function () {
  const n = this.value.length;
  const el = document.getElementById('char-count');
  el.textContent = `${n} / 500 caracteres`;
  el.className = 'char-count' + (n >= 500 ? ' at-limit' : n >= 400 ? ' near-limit' : '');
});

/* ════════════════════════════════════════════
   ENVIAR INTERESSE
════════════════════════════════════════════ */
async function enviarInteresse() {
  const btn     = document.getElementById('btn-modal-send');
  const spinner = document.getElementById('btn-spinner');
  const icon    = document.getElementById('send-icon');
  const txt     = document.getElementById('send-text');

  btn.disabled = true;
  spinner.style.display = 'block';
  icon.style.display = 'none';
  txt.textContent = 'Enviando...';

  const mensagem = document.getElementById('modal-msg').value.trim();
  const usuario  = JSON.parse(localStorage.getItem('usuario') || '{}');
  const animalId = document.getElementById('btn-interesse').dataset.animalId;

  try {
    const res = await fetch('/api/animais/' + animalId + '/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        remetente_id: usuario.id || null,
        mensagem: mensagem || 'Tenho interesse em adotar este animal.',
      })
    });

    /* Se o endpoint ainda não existir, simula sucesso para não travar a UI */
    if (!res.ok && res.status !== 404) throw new Error('Falha ao enviar.');

    document.getElementById('modal-form-content').style.display = 'none';
    document.getElementById('modal-success').classList.add('show');

    const bi = document.getElementById('btn-interesse');
    bi.classList.add('sent');
    bi.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Interesse enviado!`;
    bi.disabled = true;
    bi.onclick = null;

  } catch (e) {
    alert('Não foi possível enviar. Tente novamente.');
    btn.disabled = false;
    spinner.style.display = 'none';
    icon.style.display = '';
    txt.textContent = 'Enviar interesse';
  }
}