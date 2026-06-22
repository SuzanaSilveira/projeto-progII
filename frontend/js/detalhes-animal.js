
// ---- DADOS DO ANIMAL ----
// Em producao, busque via: fetch('/api/animais/' + id)
const ANIMAL = {
  id: 1,
  nome: 'Bolinha',
  especie: 'Cachorro',
  raca: 'SRD (Sem Raca Definida)',
  porte: 'Pequeno',
  idade: '2 anos',
  sexo: 'Macho',
  descricao: 'O Bolinha e um caozinho alegre e cheio de energia que adora brincar e receber carinho. Ele se da muito bem com criancas e outros pets. Foi resgatado ainda filhote e desde entao vive sob os cuidados da nossa ONG. Esta vacinado, castrado e pronto para encontrar um lar cheio de amor.',
  imagem_url: null,
  ong: 'ONG Patinhas Felizes',
};

const PLACEHOLDER_SVG = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="400" height="300" fill="#A8D8C8"/><ellipse cx="200" cy="195" rx="110" ry="75" fill="#E8C87A"/><rect x="145" y="228" width="28" height="55" rx="14" fill="#D4A852"/><rect x="184" y="233" width="28" height="52" rx="14" fill="#D4A852"/><rect x="224" y="233" width="28" height="52" rx="14" fill="#D4A852"/><rect x="261" y="228" width="28" height="55" rx="14" fill="#D4A852"/><ellipse cx="148" cy="145" rx="62" ry="57" fill="#E8C87A"/><ellipse cx="126" cy="126" rx="22" ry="28" fill="#D4A852"/><ellipse cx="170" cy="126" rx="22" ry="28" fill="#D4A852"/><circle cx="136" cy="145" r="6" fill="#1A1A1A"/><circle cx="161" cy="145" r="6" fill="#1A1A1A"/><circle cx="137.5" cy="143" r="2" fill="white"/><circle cx="162.5" cy="143" r="2" fill="white"/><ellipse cx="148" cy="178" rx="13" ry="8" fill="#C47A5A"/><path d="M310 180 Q345 145 332 112" stroke="#E8C87A" stroke-width="20" fill="none" stroke-linecap="round"/></svg>`;

document.addEventListener('DOMContentLoaded', () => {
  const a = ANIMAL;
  document.title = a.nome + ' - Amigo Fiel';
  document.getElementById('bc-nome').textContent = a.nome;
  document.getElementById('animal-nome').textContent = a.nome;
  document.getElementById('desc-nome').textContent = a.nome;
  document.getElementById('modal-animal-nome').textContent = a.nome;
  document.getElementById('animal-descricao').textContent = a.descricao;
  document.getElementById('ong-nome').textContent = a.ong;

  // foto
  const wrap = document.getElementById('animal-photo-wrap');
  if (a.imagem_url) {
    wrap.innerHTML = '<img src="' + a.imagem_url + '" alt="Foto de ' + a.nome + '" /><span class="photo-badge-species">' + (a.especie === 'Cachorro' ? '🐶' : '🐱') + ' ' + a.especie + '</span>';
  } else {
    wrap.innerHTML = PLACEHOLDER_SVG + '<span class="photo-badge-species">' + (a.especie === 'Cachorro' ? '🐶 Cachorro' : '🐱 Gato') + '</span>';
  }

  // meta tags
  const metaRow = document.getElementById('animal-meta-row');
  [a.especie, a.porte + ' porte', a.idade].forEach(t => {
    const s = document.createElement('span');
    s.className = 'meta-tag'; s.textContent = t;
    metaRow.appendChild(s);
  });

  // detalhes
  const campos = [
    { label: 'Especie', valor: a.especie },
    { label: 'Raca', valor: a.raca },
    { label: 'Porte', valor: a.porte },
    { label: 'Idade', valor: a.idade },
    { label: 'Sexo', valor: a.sexo },
  ];
  const grid = document.getElementById('detail-grid');
  campos.forEach(function (c) {
    const div = document.createElement('div');
    div.className = 'detail-item';
    div.innerHTML = '<label>' + c.label + '</label><span>' + c.valor + '</span>';
    grid.appendChild(div);
  });

  renderMore();
});

// mais animais
const OUTROS = [
  { nome: 'Luna', especie: 'gato', porte: 'Medio', idade: '1 ano' },
  { nome: 'Thor', especie: 'cachorro', porte: 'Grande', idade: '3 anos' },
  { nome: 'Mel', especie: 'gato', porte: 'Pequeno', idade: '4 meses' },
  { nome: 'Pipoca', especie: 'cachorro', porte: 'Medio', idade: '4 anos' },
];
const MINI = {
  cachorro: '<svg viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg"><rect width="260" height="130" fill="#D4E8F0"/><ellipse cx="130" cy="88" rx="72" ry="42" fill="#C8A882"/><ellipse cx="88" cy="56" rx="36" ry="32" fill="#C8A882"/><ellipse cx="75" cy="46" rx="12" ry="16" fill="#B8946C"/><ellipse cx="100" cy="46" rx="12" ry="16" fill="#B8946C"/><circle cx="82" cy="58" r="4" fill="#1A1A1A"/><circle cx="96" cy="58" r="4" fill="#1A1A1A"/><path d="M202 80 Q222 60 210 42" stroke="#C8A882" stroke-width="12" fill="none" stroke-linecap="round"/></svg>',
  gato: '<svg viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg"><rect width="260" height="130" fill="#E8E8F8"/><ellipse cx="130" cy="88" rx="65" ry="40" fill="#888"/><ellipse cx="97" cy="56" rx="34" ry="32" fill="#888"/><polygon points="74,42 64,20 88,35" fill="#888"/><polygon points="120,42 130,20 106,35" fill="#888"/><polygon points="76,40 68,22 88,35" fill="#F9C5C5"/><polygon points="118,40 128,22 106,35" fill="#F9C5C5"/><circle cx="87" cy="56" r="4" fill="#1A1A1A"/><circle cx="108" cy="56" r="4" fill="#1A1A1A"/><path d="M195 82 Q220 66 215 46" stroke="#888" stroke-width="9" fill="none" stroke-linecap="round"/></svg>',
};
function renderMore() {
  const g = document.getElementById('more-grid');
  OUTROS.forEach(function (a) {
    const c = document.createElement('a');
    c.href = 'detalhes-animal.html';
    c.className = 'mini-card';
    c.innerHTML = '<div class="mini-card-img">' + (MINI[a.especie] || MINI.cachorro) + '</div><div class="mini-card-body"><div class="mini-card-name">' + a.nome + '</div><div class="mini-card-tags"><span class="mini-tag">' + a.porte + '</span><span class="mini-tag">' + a.idade + '</span></div></div>';
    g.appendChild(c);
  });
}

// MODAL
function abrirModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(function () { document.getElementById('modal-msg').focus() }, 300);
}
function fecharModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === e.currentTarget) fecharModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') fecharModal();
});

// contador caracteres
document.getElementById('modal-msg').addEventListener('input', function () {
  const n = this.value.length;
  const el = document.getElementById('char-count');
  el.textContent = n + ' / 500 caracteres';
  el.className = 'char-count' + (n >= 500 ? ' at-limit' : n >= 400 ? ' near-limit' : '');
});

// ENVIAR INTERESSE
async function enviarInteresse() {
  const btn = document.getElementById('btn-modal-send');
  const spinner = document.getElementById('btn-spinner');
  const icon = document.getElementById('send-icon');
  const txt = document.getElementById('send-text');
  btn.disabled = true;
  spinner.style.display = 'block';
  icon.style.display = 'none';
  txt.textContent = 'Enviando...';
  const mensagem = document.getElementById('modal-msg').value.trim();

  try {
    /* INTEGRACAO COM BACKEND:
    const res = await fetch('/api/contatos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        remetente_id: getUsuarioId(),
        animal_id: ANIMAL.id,
        mensagem: mensagem || null,
        data_contato: new Date().toISOString(),
        status: 'pendente'
      })
    });
    if (!res.ok) throw new Error('Falha ao enviar.');
    */
    await new Promise(function (r) { setTimeout(r, 1400) });

    document.getElementById('modal-form-content').style.display = 'none';
    document.getElementById('modal-success').classList.add('show');

    const bi = document.getElementById('btn-interesse');
    bi.classList.add('sent');
    bi.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Interesse enviado!';
    bi.disabled = true;
    bi.onclick = null;
  } catch (e) {
    alert('Nao foi possivel enviar. Tente novamente.');
    btn.disabled = false;
    spinner.style.display = 'none';
    icon.style.display = '';
    txt.textContent = 'Enviar interesse';
  }
}
function getUsuarioId() { return 1; /* sessionStorage.getItem('userId') */ }
