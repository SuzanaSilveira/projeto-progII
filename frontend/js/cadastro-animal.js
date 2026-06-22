
/* ════════════════════════════════════════════
   ESTADO DO ARQUIVO SELECIONADO
════════════════════════════════════════════ */
let arquivoSelecionado = null;

const $ = id => document.getElementById(id);

const uploadZone = $('upload-zone');
const fotoInput = $('foto');
const uploadPreview = $('upload-preview');
const previewThumb = $('upload-preview-thumb');
const previewName = $('upload-preview-name');
const previewSize = $('upload-preview-size');
const removeBtn = $('upload-preview-remove');

const previewImgArea = $('preview-img-area');
const previewImgTag = $('preview-img-tag');
const previewPlaceholder = $('preview-img-placeholder');
const speciesBadgeEl = $('preview-species-badge');

/* ── Formata tamanho do arquivo ── */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ── Processa o arquivo selecionado (input ou drag&drop) ── */
function handleFile(file) {
  if (!file) return;

  // valida tipo
  const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!tiposPermitidos.includes(file.type)) {
    alert('Formato não suportado. Envie uma imagem PNG, JPG ou WEBP.');
    return;
  }

  // valida tamanho (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 5MB.');
    return;
  }

  arquivoSelecionado = file;
  clearErr('field-foto');

  // lê o arquivo para gerar preview local (FileReader)
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;

    // preview dentro do mini-card de upload
    previewThumb.src = dataUrl;
    previewName.textContent = file.name;
    previewSize.textContent = formatBytes(file.size);
    uploadPreview.classList.add('show');
    uploadZone.style.display = 'none';

    // preview dentro do card grande (lado esquerdo)
    previewImgTag.src = dataUrl;
    previewImgTag.style.display = 'block';
    previewPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);

  updatePreview();
}

/* clique no input padrão */
fotoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleFile(file);
});

/* drag and drop */
['dragenter', 'dragover'].forEach(evt => {
  uploadZone.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation();
    uploadZone.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach(evt => {
  uploadZone.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation();
    uploadZone.classList.remove('dragover');
  });
});
uploadZone.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file) {
    // sincroniza com o input para o submit funcionar normalmente
    const dt = new DataTransfer();
    dt.items.add(file);
    fotoInput.files = dt.files;
    handleFile(file);
  }
});

/* remover arquivo selecionado */
removeBtn.addEventListener('click', () => {
  arquivoSelecionado = null;
  fotoInput.value = '';
  uploadPreview.classList.remove('show');
  uploadZone.style.display = 'block';

  previewImgTag.src = '';
  previewImgTag.style.display = 'none';
  previewPlaceholder.style.display = 'flex';

  updatePreview();
});

/* ════════════════════════════════════════════
   PREVIEW AO VIVO (card da esquerda)
════════════════════════════════════════════ */
function updatePreview() {
  const nome = $('nome').value.trim();
  const especie = $('especie').value;
  const porte = $('porte').value;
  const idade = $('idade').value.trim();
  const descricao = $('descricao').value.trim();

  // Nome
  $('preview-name').textContent = nome || 'Nome do animal...';
  $('preview-name').style.cssText = nome
    ? 'color:var(--dark);font-style:normal;font-size:1.35rem'
    : 'color:#C4C4C4;font-style:italic;font-size:1rem';

  // Tags
  const tags = [];
  if (especie) tags.push(especie === 'cachorro' ? '🐶 Cachorro' : '🐱 Gato');
  if (porte) tags.push(porte + ' porte');
  if (idade) tags.push(idade);

  const previewTags = $('preview-tags');
  if (tags.length) {
    previewTags.innerHTML = tags.map(t => `<span class="ptag">${t}</span>`).join('');
  } else {
    previewTags.innerHTML = `
        <span class="ptag" style="opacity:.4">Espécie</span>
        <span class="ptag" style="opacity:.4">Porte</span>
        <span class="ptag" style="opacity:.4">Idade</span>`;
  }

  // Descrição
  const previewDesc = $('preview-desc');
  previewDesc.textContent = descricao || 'Descrição aparece aqui...';
  previewDesc.style.cssText = descricao
    ? 'color:var(--muted);font-style:normal'
    : 'color:#D1D5DB;font-style:italic';

  // Badge de espécie sobre a foto
  if (especie) {
    speciesBadgeEl.textContent = especie === 'cachorro' ? '🐶 Cachorro' : '🐱 Gato';
    speciesBadgeEl.style.display = 'block';
  } else {
    speciesBadgeEl.style.display = 'none';
  }
}

// Ouvintes nos campos de texto
['nome', 'especie', 'porte', 'idade', 'descricao'].forEach(id => {
  $(id).addEventListener('input', updatePreview);
  $(id).addEventListener('change', updatePreview);
});

/* ════════════════════════════════════════════
   VALIDAÇÃO
════════════════════════════════════════════ */
function setErr(id) { $(id).classList.add('has-error'); }
function clearErr(id) { $(id).classList.remove('has-error'); }

['nome', 'especie', 'porte', 'idade', 'descricao'].forEach(id => {
  $(id).addEventListener('input', () => clearErr('field-' + id));
  $(id).addEventListener('change', () => clearErr('field-' + id));
});

/* ════════════════════════════════════════════
   SUBMIT — UPLOAD + CADASTRO (2 ETAPAS)
════════════════════════════════════════════ */
$('animal-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  const nome = $('nome').value.trim();
  const especie = $('especie').value;
  const porte = $('porte').value;
  const idade = $('idade').value.trim();
  const descricao = $('descricao').value.trim();

  if (!nome) { setErr('field-nome'); valid = false; }
  if (!especie) { setErr('field-especie'); valid = false; }
  if (!porte) { setErr('field-porte'); valid = false; }
  if (!idade) { setErr('field-idade'); valid = false; }
  if (!descricao) { setErr('field-descricao'); valid = false; }
  if (!arquivoSelecionado) { setErr('field-foto'); valid = false; }

  if (!valid) return;

  const btn = $('btn-submit');
  btn.disabled = true;
  $('spinner').style.display = 'block';
  $('btn-icon').style.display = 'none';

  const progressWrap = $('upload-progress-wrap');
  const progressFill = $('upload-progress-fill');
  const progressPct = $('upload-progress-percent');
  const progressText = $('upload-progress-text');

  try {
    /* ════════════════════════════════════════
       ETAPA 1 — UPLOAD DA IMAGEM
       POST /api/upload  →  { url: "/uploads/xxxx.jpg" }
    ════════════════════════════════════════ */
    $('btn-text').textContent = 'Enviando imagem...';
    progressWrap.classList.add('show');
    progressText.textContent = 'Enviando imagem...';

    const formData = new FormData();
    formData.append('imagem', arquivoSelecionado);

    // ── Upload real com progresso (XMLHttpRequest, pois fetch não expõe progress nativo) ──
    const urlRecebida = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const pct = Math.round((ev.loaded / ev.total) * 100);
          progressFill.style.width = pct + '%';
          progressPct.textContent = pct + '%';
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);

            if (!data.success) {
              reject(new Error('Falha ao enviar a imagem.'));
              return;
            }

            resolve(data.imagem_url);

          } catch (err) {
            reject(new Error('Resposta inválida do servidor de upload.'));
          }

        } else {
          reject(new Error('Falha ao enviar a imagem.'));
        }
      };

      xhr.onerror = () => reject(new Error('Erro de conexão ao enviar a imagem.'));
      xhr.send(formData);
    });

    /* ════════════════════════════════════════
       ETAPA 2 — CADASTRO DO ANIMAL
       POST /api/animais
    ════════════════════════════════════════ */
    $('btn-text').textContent = 'Publicando...';
    progressText.textContent = 'Salvando cadastro...';
    progressFill.style.width = '100%';
    progressPct.textContent = '100%';

    // administrador_id deve vir da sessão/token do admin logado
    const administrador_id = getAdminId();

    const res = await fetch('/api/animais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        especie,
        idade,
        porte,
        descricao,
        imagem_url: urlRecebida,
        administrador_id
      })
    });

    if (!res.ok) {
      throw new Error('Falha ao cadastrar o animal.');
    }

    /* ── SUCESSO ── */
    $('spinner').style.display = 'none';
    $('btn-text').textContent = '✓ Publicado!';
    btn.style.background = '#22c55e';

    showToast('success', 'Animal cadastrado com sucesso!', `"${nome}" foi publicado na plataforma 🐾`);

    setTimeout(() => { window.location.href = 'tela-admin.html'; }, 2200);

  } catch (err) {
    /* ── ERRO ── */
    console.error(err);
    progressWrap.classList.remove('show');
    btn.disabled = false;
    $('spinner').style.display = 'none';
    $('btn-icon').style.display = '';
    $('btn-text').textContent = 'Publicar animal';

    showToast('error', 'Algo deu errado', err.message || 'Não foi possível concluir o cadastro. Tente novamente.');
  }
});

/* ── ID do admin logado (placeholder até integrar sessão real) ── */
function getAdminId() {
  // return sessionStorage.getItem('adminId');
  return 1;
}

/* ── Toast ── */
function showToast(type, title, text) {
  const toast = $('toast');
  toast.classList.toggle('error', type === 'error');
  $('toast-title').textContent = title;
  $('toast-animal-name').textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}