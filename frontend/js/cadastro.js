
/* ════════════════════════════
   UTILITÁRIOS
════════════════════════════ */
const $ = id => document.getElementById(id);

function setValid(fieldId, inputEl, checkId) {
  const field = $(fieldId);
  field.classList.remove('has-error');
  if (inputEl) inputEl.classList.remove('is-invalid'); inputEl.classList.add('is-valid');
  if (checkId) { const c = $(checkId); if (c) { c.classList.add('show'); } }
}
function setError(fieldId, inputEl, checkId) {
  const field = $(fieldId);
  field.classList.add('has-error');
  if (inputEl) { inputEl.classList.remove('is-valid'); inputEl.classList.add('is-invalid'); }
  if (checkId) { const c = $(checkId); if (c) c.classList.remove('show'); }
}
function clearState(fieldId, inputEl, checkId) {
  const field = $(fieldId);
  field.classList.remove('has-error');
  if (inputEl) { inputEl.classList.remove('is-valid', 'is-invalid'); }
  if (checkId) { const c = $(checkId); if (c) c.classList.remove('show'); }
}

/* ── Toggle senha ── */
function makeToggle(inputId, openId, closeId) {
  const btn = document.getElementById('toggle-' + inputId.replace('field-', ''));
  // IDs dos botões: toggle-senha, toggle-confirmar
  return;
}

function setupToggle(btnId, inputId, eye1, eye2) {
  $(btnId).addEventListener('click', () => {
    const inp = $(inputId);
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    $(eye1).style.display = show ? 'none' : '';
    $(eye2).style.display = show ? '' : 'none';
  });
}
setupToggle('toggle-senha', 'senha', 'eye-s1', 'eye-s2');
setupToggle('toggle-confirmar', 'confirmar', 'eye-c1', 'eye-c2');

/* ── Máscara telefone ── */
$('telefone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d*)/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d*)/, '($1) $2');
  this.value = v;
});

/* ── Força da senha ── */
const senhaInp = $('senha');
const bars = [$('sb1'), $('sb2'), $('sb3'), $('sb4')];
const strengthLabel = $('strength-label');
const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#22c55e'];
const LABELS = ['Senha fraca', 'Senha razoável', 'Senha boa', 'Senha forte'];

function calcStrength(v) {
  let s = 0;
  if (v.length >= 6) s++;
  if (v.length >= 10) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) s++;
  return s;
}

senhaInp.addEventListener('input', () => {
  const v = senhaInp.value;
  const s = v.length === 0 ? 0 : Math.max(1, calcStrength(v));
  bars.forEach((b, i) => {
    b.style.background = i < s ? COLORS[s - 1] : '#E5E7EB';
  });
  strengthLabel.textContent = v.length === 0 ? '' : LABELS[s - 1];
  strengthLabel.style.color = v.length === 0 ? '' : COLORS[s - 1];
});

/* ── Validação em tempo real ── */
const nomeInp = $('nome');
const emailInp = $('email');
const confirmarInp = $('confirmar');

nomeInp.addEventListener('blur', () => {
  if (nomeInp.value.trim().length < 2) setError('field-nome', nomeInp, 'check-nome');
  else setValid('field-nome', nomeInp, 'check-nome');
});
nomeInp.addEventListener('input', () => {
  if (nomeInp.value.trim().length >= 2) setValid('field-nome', nomeInp, 'check-nome');
});

emailInp.addEventListener('blur', () => {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInp.value.trim());
  if (!ok) setError('field-email', emailInp, 'check-email');
  else setValid('field-email', emailInp, 'check-email');
});
emailInp.addEventListener('input', () => {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInp.value.trim());
  if (ok) setValid('field-email', emailInp, 'check-email');
  else clearState('field-email', emailInp, 'check-email');
});

senhaInp.addEventListener('blur', () => {
  if (senhaInp.value.length < 6) setError('field-senha', senhaInp, null);
  else setValid('field-senha', senhaInp, null);
});

confirmarInp.addEventListener('input', () => {
  if (confirmarInp.value && confirmarInp.value !== senhaInp.value) {
    setError('field-confirmar', confirmarInp, null);
  } else if (confirmarInp.value === senhaInp.value && confirmarInp.value.length > 0) {
    setValid('field-confirmar', confirmarInp, null);
  }
});

/* ── SUBMIT ── */
$('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  // Nome
  if (nomeInp.value.trim().length < 2) { setError('field-nome', nomeInp, 'check-nome'); valid = false; }
  // Email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInp.value.trim())) { setError('field-email', emailInp, 'check-email'); valid = false; }
  // Senha
  if (senhaInp.value.length < 6) { setError('field-senha', senhaInp, null); valid = false; }
  // Confirmar
  if (confirmarInp.value !== senhaInp.value) { setError('field-confirmar', confirmarInp, null); valid = false; }
  // Termos
  if (!$('termos').checked) {
    $('termos').style.outline = '2px solid #EF4444';
    valid = false;
  } else { $('termos').style.outline = ''; }

  if (!valid) return;

  /* Loading */
  const btn = $('btn-register');
  btn.disabled = true;
  $('spinner').style.display = 'block';
  $('btn-icon').style.display = 'none';
  $('btn-text').textContent = 'Criando conta...';

  try {


    // INSERÇÃO NO BANCO !!!!!!!!!!!!!
    const res = await fetch('/api/usuarios/cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        nome: nomeInp.value.trim(),
        email: emailInp.value.trim().toLowerCase(),
        senha: senhaInp.value,
        telefone: $('telefone').value
      })
    });

    const data = await res.json();

    if (!res.ok) {

      alert(data.erro || 'Erro ao cadastrar');

      btn.disabled = false;
      $('spinner').style.display = 'none';
      $('btn-icon').style.display = '';
      $('btn-text').textContent = 'Criar minha conta';

      return;
    }

    // sucesso
    $('spinner').style.display = 'none';
    $('btn-text').textContent = '✓ Conta criada!';
    btn.style.background = '#22c55e';

    const toast = $('toast');
    toast.classList.add('show');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2400);

  } catch (err) {

    console.error(err);

    alert('Erro ao conectar com o servidor.');

    btn.disabled = false;
    $('spinner').style.display = 'none';
    $('btn-icon').style.display = '';
    $('btn-text').textContent = 'Criar minha conta';
  }

  /* Sucesso */
  $('spinner').style.display = 'none';
  $('btn-text').textContent = '✓ Conta criada!';
  btn.style.background = '#22c55e';

  const toast = $('toast');
  toast.classList.add('show');

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2400);
});