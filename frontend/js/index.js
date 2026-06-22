async function carregarAnimais() {
  try {
    const resposta = await fetch('/api/animais/disponiveis');
    const dados = await resposta.json();

    const grid = document.getElementById('animals-grid');
    grid.innerHTML = '';

    dados.animais.forEach(animal => {

      const card = document.createElement('article');
      card.className = 'animal-card reveal';

      card.innerHTML = `
                <div class="card-img-wrap">

                    <img
                        src="${animal.imagem_url}"
                        alt="${animal.nome}"
                        class="card-img"
                    >

                    <span class="card-badge">✓ Disponível</span>

                    <span class="card-species">
                        ${animal.especie === 'cachorro' ? '🐶 Cachorro' : '🐱 Gato'}
                    </span>

                </div>

                <div class="card-body">

                    <div class="card-name">
                        ${animal.nome}
                    </div>

                    <div class="card-meta">
                        <span class="tag">${animal.porte}</span>
                        <span class="tag">${animal.idade}</span>
                    </div>

                    <a
                        href="/pages/detalhes-animal.html?id=${animal.id}"
                        class="card-btn"
                    >
                        Ver detalhes
                    </a>

                </div>
            `;

      grid.appendChild(card);
    });

  } catch (erro) {
    console.error(erro);
  }
}

document.addEventListener('DOMContentLoaded', carregarAnimais);