
/* ── Toggle senha ── */
const pwInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggle-pw');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');

toggleBtn.addEventListener('click', () => {
  const show = pwInput.type === 'password';
  pwInput.type = show ? 'text' : 'password';
  eyeOpen.style.display = show ? 'none' : '';
  eyeClosed.style.display = show ? '' : 'none';
});

/* ── Login REAL com backend ── */
const form = document.getElementById('login-form');
const btnLogin = document.getElementById('btn-login');
const spinner = document.getElementById('spinner');
const btnIcon = document.getElementById('btn-icon');
const btnText = document.getElementById('btn-text');

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  const email = document.getElementById('email');
  const pass = document.getElementById('password');
  const fEmail = document.getElementById('field-email');
  const fPass = document.getElementById('field-password');

  fEmail.classList.remove('invalid');
  fPass.classList.remove('invalid');

  if (!validateEmail(email.value.trim())) {
    fEmail.classList.add('invalid');
    valid = false;
  }
  if (pass.value.length < 6) {
    fPass.classList.add('invalid');
    valid = false;
  }
  if (!valid) return;

  // Loading
  btnLogin.disabled = true;
  spinner.style.display = 'block';
  btnIcon.style.display = 'none';
  btnText.textContent = 'Entrando...';

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        senha: pass.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || 'Erro no login');
    }

    // Salvar token e usuário
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    console.log('✅ Login realizado!');
    console.log('Token:', data.token);
    console.log('Usuário:', data.usuario);

    // Sucesso visual
    spinner.style.display = 'none';
    btnText.textContent = '✓ Sucesso!';
    btnLogin.style.background = '#22c55e';

    // Redirecionar baseado no tipo
    setTimeout(() => {
      if (data.usuario.tipo === 'admin') {
        window.location.href = 'dashboard-admin.html';
      } else {
        window.location.href = '../pages/index.html';
      }
    }, 1000);

  } catch (error) {
    console.error('Erro:', error);
    spinner.style.display = 'none';
    btnIcon.style.display = '';
    btnText.textContent = 'Entrar';
    btnLogin.disabled = false;
    alert(error.message);
  }
});

document.getElementById('email').addEventListener('input', () => {
  document.getElementById('field-email').classList.remove('invalid');
});
document.getElementById('password').addEventListener('input', () => {
  document.getElementById('field-password').classList.remove('invalid');
});
