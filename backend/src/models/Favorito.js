/* ════════════════════════════════════════════
   Favorito.js — Modelo de domínio
   Representa o interesse salvo de um usuário
   por um animal específico
════════════════════════════════════════════ */

/* Exceção personalizada para erros de favorito */
class FavoritoException extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'FavoritoException';
  }
}

/* Classe base de favorito com encapsulamento */
class Favorito {
  #usuarioId;
  #animalId;
  #dataCriacao;

  constructor(usuarioId, animalId) {
    if (!usuarioId) throw new FavoritoException('Usuário é obrigatório para favoritar.');
    if (!animalId) throw new FavoritoException('Animal é obrigatório para favoritar.');

    this.#usuarioId = usuarioId;
    this.#animalId = animalId;
    this.#dataCriacao = new Date();
  }

  /* Getters — acesso controlado aos atributos privados */
  get usuarioId() { return this.#usuarioId; }
  get animalId() { return this.#animalId; }
  get dataCriacao() { return this.#dataCriacao; }

  /* Retorna representação simples para persistência */
  toJSON() {
    return {
      usuario_id: this.#usuarioId,
      animal_id: this.#animalId,
      data_favoritado: this.#dataCriacao.toISOString(),
    };
  }
}

/* ── Agregação: lista que gerencia vários Favoritos ── */
class ListaDeFavoritos {
  #itens;

  constructor() {
    this.#itens = [];
  }

  /* Adiciona um Favorito à lista */
  adicionar(favorito) {
    if (!(favorito instanceof Favorito)) {
      throw new FavoritoException('Item inválido: esperado um Favorito.');
    }

    /* Evita duplicatas na lista em memória */
    const jaSalvo = this.#itens.some(
      f => f.animalId === favorito.animalId && f.usuarioId === favorito.usuarioId
    );
    if (jaSalvo) throw new FavoritoException('Animal já está nos favoritos.');

    this.#itens.push(favorito);
  }

  /* Remove pelo id do animal */
  remover(animalId) {
    const antes = this.#itens.length;
    this.#itens = this.#itens.filter(f => f.animalId !== animalId);
    if (this.#itens.length === antes) throw new FavoritoException('Favorito não encontrado.');
  }

  get total() { return this.#itens.length; }
  get itens() { return [...this.#itens]; } // cópia — não expõe o array original
}

/* ── Herança: favorito com prioridade marcada pelo usuário ── */
class FavoritoPrioritario extends Favorito {
  #prioridade;

  constructor(usuarioId, animalId, prioridade = 'alta') {
    super(usuarioId, animalId);
    this.#prioridade = prioridade;
  }

  get prioridade() { return this.#prioridade; }

  /* Sobrescreve toJSON para incluir prioridade */
  toJSON() {
    return { ...super.toJSON(), prioridade: this.#prioridade };
  }
}

module.exports = { Favorito, FavoritoPrioritario, ListaDeFavoritos, FavoritoException };