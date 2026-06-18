const AVATARS = {
  cachorro1: {
    bg: '#A8D8C8',
    label: '🐶 Cachorro',
    svg: `
        <svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="210" fill="#A8D8C8"/>
          <ellipse cx="150" cy="145" rx="80" ry="55" fill="#E8C87A"/>
          <rect x="108" y="168" width="20" height="40" rx="10" fill="#D4A852"/>
          <rect x="138" y="172" width="20" height="38" rx="10" fill="#D4A852"/>
          <rect x="168" y="172" width="20" height="36" rx="10" fill="#D4A852"/>
          <rect x="196" y="168" width="20" height="38" rx="10" fill="#D4A852"/>
          <ellipse cx="108" cy="110" rx="44" ry="40" fill="#E8C87A"/>
          <ellipse cx="93" cy="97" rx="15" ry="19" fill="#D4A852"/>
          <ellipse cx="122" cy="97" rx="15" ry="19" fill="#D4A852"/>
          <ellipse cx="107" cy="123" rx="20" ry="13" fill="#D4A852"/>
          <circle cx="99" cy="110" r="4" fill="#1A1A1A"/>
          <circle cx="116" cy="110" r="4" fill="#1A1A1A"/>
          <circle cx="100.5" cy="108.5" r="1.4" fill="white"/>
          <circle cx="117.5" cy="108.5" r="1.4" fill="white"/>
          <ellipse cx="107" cy="130" rx="9" ry="6" fill="#C47A5A"/>
          <path d="M230 135 Q255 105 240 80" stroke="#E8C87A" stroke-width="14" fill="none" stroke-linecap="round"/>
        </svg>`
  },
  cachorro2: {
    bg: '#D4E8F0',
    label: '🐶 Cachorro',
    svg: `
        <svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="210" fill="#D4E8F0"/>
          <ellipse cx="155" cy="140" rx="95" ry="58" fill="#C8A882"/>
          <rect x="104" y="163" width="22" height="45" rx="11" fill="#B8946C"/>
          <rect x="136" y="168" width="22" height="42" rx="11" fill="#B8946C"/>
          <rect x="170" y="168" width="22" height="42" rx="11" fill="#B8946C"/>
          <rect x="202" y="163" width="22" height="45" rx="11" fill="#B8946C"/>
          <ellipse cx="100" cy="98" rx="50" ry="45" fill="#C8A882"/>
          <ellipse cx="83" cy="84" rx="17" ry="22" fill="#B8946C"/>
          <ellipse cx="117" cy="84" rx="17" ry="22" fill="#B8946C"/>
          <ellipse cx="100" cy="115" rx="22" ry="14" fill="#B8946C"/>
          <circle cx="91" cy="100" r="5" fill="#1A1A1A"/>
          <circle cx="110" cy="100" r="5" fill="#1A1A1A"/>
          <ellipse cx="185" cy="128" rx="25" ry="18" fill="rgba(0,0,0,.12)"/>
          <path d="M250 120 Q270 95 255 72" stroke="#C8A882" stroke-width="16" fill="none" stroke-linecap="round"/>
        </svg>`
  },
  gato1: {
    bg: '#E8E8F8',
    label: '🐱 Gato',
    svg: `
        <svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg">
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
          <circle cx="137" cy="98" r="1.5" fill="white"/>
          <circle cx="157" cy="98" r="1.5" fill="white"/>
          <ellipse cx="145" cy="114" rx="8" ry="5" fill="#F9C5C5"/>
          <ellipse cx="128" cy="92" rx="12" ry="9" fill="rgba(0,0,0,.18)"/>
          <ellipse cx="145" cy="148" rx="30" ry="20" fill="rgba(255,255,255,.15)"/>
        </svg>`
  },
  gato2: {
    bg: '#F0E8F8',
    label: '🐱 Gato',
    svg: `
        <svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="210" fill="#F0E8F8"/>
          <ellipse cx="150" cy="148" rx="68" ry="50" fill="#F4A035"/>
          <rect x="120" y="165" width="18" height="40" rx="9" fill="#E8943A"/>
          <rect x="150" y="170" width="18" height="37" rx="9" fill="#E8943A"/>
          <rect x="178" y="170" width="18" height="37" rx="9" fill="#E8943A"/>
          <path d="M218 150 Q248 125 240 100 Q234 85 225 95" stroke="#F4A035" stroke-width="13" fill="none" stroke-linecap="round"/>
          <ellipse cx="148" cy="100" rx="46" ry="42" fill="#F4A035"/>
          <polygon points="115,82 103,55 130,72" fill="#F4A035"/>
          <polygon points="180,82 192,55 165,72" fill="#F4A035"/>
          <polygon points="117,80 107,58 130,72" fill="#F9C5C5"/>
          <polygon points="178,80 188,58 165,72" fill="#F9C5C5"/>
          <circle cx="137" cy="98" r="5" fill="#2D3748"/>
          <circle cx="158" cy="98" r="5" fill="#2D3748"/>
          <circle cx="139" cy="96" r="1.5" fill="white"/>
          <circle cx="160" cy="96" r="1.5" fill="white"/>
          <ellipse cx="147" cy="112" rx="8" ry="5" fill="#E86B3A"/>
          <path d="M130 78 L132 65" stroke="#E8943A" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M148 76 L148 63" stroke="#E8943A" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M165 78 L163 65" stroke="#E8943A" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`
  }
};

/* ════════════════════
   PREVIEW AO VIVO
════════════════════ */
const previewImg = document.getElementById('preview-img');
const previewName = document.getElementById('preview-name');
const previewTags = document.getElementById('preview-tags');
const previewDesc = document.getElementById('preview-desc');
const speciesBadge = document.querySelector('.preview-badge-species');

function updatePreview() { // função que vai atualizar os cards
  const nome = document.getElementById('nome').value.trim(); // o usuario digita e o valor é armazenado
  const especie = document.getElementById('especie').value;
  const porte = document.getElementById('porte').value;
  const idade = document.getElementById('idade').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const avatar = document.querySelector('input[name="imagem"]:checked');

  // Nome
  previewName.textContent = nome || 'Nome do animal...';
  previewName.style.cssText = nome
    ? 'color:var(--dark);font-style:normal;font-size:1.35rem' // preenchido
    : 'color:#C4C4C4;font-style:italic;font-size:1rem'; // vazio 

  // Tags
  const tags = [];
  if (especie) tags.push(especie === 'cachorro' ? '🐶 Cachorro' : '🐱 Gato');
  if (porte) tags.push(porte + ' porte');
  if (idade) tags.push(idade);

  if (tags.length) {
    previewTags.innerHTML = tags.map(t => `<span class="ptag">${t}</span>`).join('');
  } else {
    previewTags.innerHTML = `
        <span class="ptag" style="opacity:.4">Espécie</span>
        <span class="ptag" style="opacity:.4">Porte</span>
        <span class="ptag" style="opacity:.4">Idade</span>`;
  }

  // Descrição
  previewDesc.textContent = descricao || 'Descrição aparece aqui...';
  previewDesc.style.cssText = descricao
    ? 'color:var(--muted);font-style:normal'
    : 'color:#D1D5DB;font-style:italic';

  // Avatar
  const speciesBadgeEl = document.getElementById('preview-species-badge');
  if (avatar) { // verifica se algum foi selecionado
    const data = AVATARS[avatar.value];
    previewImg.innerHTML = data.svg;
    speciesBadgeEl.textContent = data.label;
    speciesBadgeEl.style.display = '';
  } else {
    previewImg.innerHTML = `<span style="color:rgba(31,92,46,.35);font-size:.8rem;font-family:Sora,sans-serif;">Selecione um avatar →</span>`;
    speciesBadgeEl.style.display = 'none';
  }
}

// Ouvintes // aparecer simultaneamente
['nome', 'especie', 'porte', 'idade', 'descricao'].forEach(id => {
  document.getElementById(id).addEventListener('input', updatePreview);
  document.getElementById(id).addEventListener('change', updatePreview);
});
document.querySelectorAll('input[name="imagem"]').forEach(r => {
  r.addEventListener('change', updatePreview);
});

/* ════════════════════
   VALIDAÇÃO + SUBMIT
════════════════════ */
function setErr(id) {
  document.getElementById(id).classList.add('has-error');
}
function clearErr(id) {
  document.getElementById(id).classList.remove('has-error');
}

// Limpa erro ao interagir
['nome', 'especie', 'porte', 'idade', 'descricao'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => clearErr('field-' + id));
  el.addEventListener('change', () => clearErr('field-' + id));
});
document.querySelectorAll('input[name="imagem"]').forEach(r => {
  r.addEventListener('change', () => clearErr('field-avatar'));
});

document.getElementById('animal-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  const nome = document.getElementById('nome').value.trim();
  const especie = document.getElementById('especie').value;
  const porte = document.getElementById('porte').value;
  const idade = document.getElementById('idade').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const avatar = document.querySelector('input[name="imagem"]:checked');

  // verificação
  if (!nome) { setErr('field-nome'); valid = false; }
  if (!especie) { setErr('field-especie'); valid = false; }
  if (!porte) { setErr('field-porte'); valid = false; }
  if (!idade) { setErr('field-idade'); valid = false; }
  if (!descricao) { setErr('field-descricao'); valid = false; }
  if (!avatar) { setErr('field-avatar'); valid = false; }

  if (!valid) return;

  // Loading
  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  document.getElementById('spinner').style.display = 'block';
  document.getElementById('btn-icon').style.display = 'none';
  document.getElementById('btn-text').textContent = 'Publicando...';

  await new Promise(r => setTimeout(r, 1500));

  // Sucesso
  document.getElementById('spinner').style.display = 'none';
  document.getElementById('btn-text').textContent = '✓ Publicado!';
  btn.style.background = '#22c55e';

  const toast = document.getElementById('toast');
  document.getElementById('toast-animal-name').textContent =
    `"${nome}" foi publicado na plataforma 🐾`;
  toast.classList.add('show');

  setTimeout(() => {
    // Redirecionar para a lista de animais após sucesso
    window.location.href = 'animais.html';
  }, 2500);
});