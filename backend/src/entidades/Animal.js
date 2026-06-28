const db = require('../database/database');

/**
 * Entidade Animal
 * Representa um animal disponível (ou não) para adoção.
 * Atributos e métodos seguem o diagrama de classes do domínio.
 */
class Animal {
    constructor(id, nome, especie, idade, porte, descricao, imagem_url, status, administrador_id) {
        this.id = id;
        this.nome = nome;
        this.especie = especie;
        this.idade = idade;
        this.porte = porte;
        this.descricao = descricao;
        this.imagem_url = imagem_url;
        this.status = status || 'disponivel';
        this.administrador_id = administrador_id;
    }

    /**
     * Cadastra este animal no banco, vinculado ao administrador responsável.
     */
    cadastrar() {
        if (!this.nome || !this.especie) {
            throw new DadosAnimalInvalidosError('Nome e espécie são obrigatórios.');
        }

        const stmt = db.prepare(`
            INSERT INTO animais (nome, especie, idade, porte, descricao, imagem_url, administrador_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(
            this.nome, this.especie, this.idade || null, this.porte || null,
            this.descricao || null, this.imagem_url || null, this.administrador_id, this.status
        );
        this.id = info.lastInsertRowid;
        return this;
    }

    /**
     * Lista todos os animais com status 'disponivel' (uso público).
     */
    static listarDisponiveis() {
        const linhas = db.prepare(`
            SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone
            FROM animais a
            LEFT JOIN usuarios u ON a.administrador_id = u.id
            WHERE a.status = 'disponivel'
            ORDER BY a.created_at DESC
        `).all();
        return linhas.map(Animal.fromRow);
    }

    /**
     * Lista todos os animais cadastrados por um administrador específico.
     */
    static listarPorAdministrador(administradorId) {
        const linhas = db.prepare(`
            SELECT a.*, u.nome as administrador_nome
            FROM animais a
            LEFT JOIN usuarios u ON a.administrador_id = u.id
            WHERE a.administrador_id = ?
            ORDER BY a.created_at DESC
        `).all(administradorId);
        return linhas.map(Animal.fromRow);
    }

    /**
     * Busca um animal pelo id.
     */
    static buscarPorId(id) {
        const linha = db.prepare(`
            SELECT a.*, u.nome as responsavel_nome, u.telefone as responsavel_telefone, u.email as responsavel_email
            FROM animais a
            LEFT JOIN usuarios u ON a.administrador_id = u.id
            WHERE a.id = ?
        `).get(id);

        if (!linha) {
            throw new AnimalNaoEncontradoError(id);
        }
        return Animal.fromRow(linha);
    }

    /**
     * Busca animais filtrando por espécie (uso interno/relatórios).
     */
    static buscarPorEspecie(especie) {
        const linhas = db.prepare(`
            SELECT * FROM animais WHERE especie = ? ORDER BY created_at DESC
        `).all(especie);
        return linhas.map(Animal.fromRow);
    }

    /**
     * Busca animais filtrando por porte (uso interno/relatórios).
     */
    static buscarPorPorte(porte) {
        const linhas = db.prepare(`
            SELECT * FROM animais WHERE porte = ? ORDER BY created_at DESC
        `).all(porte);
        return linhas.map(Animal.fromRow);
    }

    /**
     * Atualiza todos os dados deste animal no banco.
     */
    atualizar() {
        const stmt = db.prepare(`
            UPDATE animais
            SET nome = ?, especie = ?, idade = ?, porte = ?, descricao = ?, imagem_url = ?, status = ?
            WHERE id = ?
        `);
        const result = stmt.run(
            this.nome, this.especie, this.idade || null, this.porte || null,
            this.descricao || null, this.imagem_url || null, this.status, this.id
        );

        if (result.changes === 0) {
            throw new AnimalNaoEncontradoError(this.id);
        }
        return this;
    }

    /**
     * Atualiza somente o status deste animal (ex: 'disponivel' -> 'adotado').
     */
    atualizarStatus(novoStatus) {
        const result = db.prepare('UPDATE animais SET status = ? WHERE id = ?').run(novoStatus, this.id);
        if (result.changes === 0) {
            throw new AnimalNaoEncontradoError(this.id);
        }
        this.status = novoStatus;
        return this;
    }

    /**
     * Remove este animal do banco, junto com os contatos vinculados a ele.
     */
    deletar() {
        const contatosDeletados = db.prepare('DELETE FROM contatos WHERE animal_id = ?').run(this.id);
        const result = db.prepare('DELETE FROM animais WHERE id = ?').run(this.id);

        if (result.changes === 0) {
            throw new AnimalNaoEncontradoError(this.id);
        }
        return { contatosRemovidos: contatosDeletados.changes };
    }

    /** Indica se o animal ainda está disponível para adoção. */
    estaDisponivel() {
        return this.status === 'disponivel';
    }

    /** Converte uma linha do banco (objeto simples) em uma instância de Animal. */
    static fromRow(linha) {
        const animal = new Animal(
            linha.id, linha.nome, linha.especie, linha.idade, linha.porte,
            linha.descricao, linha.imagem_url, linha.status, linha.administrador_id
        );
        // campos extras vindos do JOIN (não fazem parte do diagrama, mas são úteis na resposta da API)
        if (linha.responsavel_nome) animal.responsavel_nome = linha.responsavel_nome;
        if (linha.responsavel_telefone) animal.responsavel_telefone = linha.responsavel_telefone;
        if (linha.responsavel_email) animal.responsavel_email = linha.responsavel_email;
        if (linha.administrador_nome) animal.administrador_nome = linha.administrador_nome;
        return animal;
    }
}

/* ── Exceções personalizadas da entidade Animal ── */
class AnimalNaoEncontradoError extends Error {
    constructor(id) {
        super(`Animal com id ${id} não encontrado.`);
        this.name = 'AnimalNaoEncontradoError';
        this.statusCode = 404;
    }
}

class DadosAnimalInvalidosError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'DadosAnimalInvalidosError';
        this.statusCode = 400;
    }
}

module.exports = { Animal, AnimalNaoEncontradoError, DadosAnimalInvalidosError };