const db = require('../database/database');

/**
 * Entidade Contato
 * Representa o interesse de um usuário (remetente) em adotar um animal.
 * Atributos e métodos seguem o diagrama de classes do domínio.
 */
class Contato {
    constructor(id, remetente_id, animal_id, mensagem, status, data_contato) {
        this.id = id;
        this.remetente_id = remetente_id;
        this.animal_id = animal_id;
        this.mensagem = mensagem;
        this.status = status || 'pendente';
        this.data_contato = data_contato;
    }

    /**
     * Registra este contato (demonstração de interesse) no banco.
     * Garante que o animal referenciado realmente existe.
     */
    registrarContato() {
        if (!this.remetente_id) {
            throw new DadosContatoInvalidosError('remetente_id é obrigatório.');
        }
        if (!this.mensagem || !this.mensagem.trim()) {
            throw new DadosContatoInvalidosError('mensagem é obrigatória.');
        }

        const animalExiste = db.prepare('SELECT id FROM animais WHERE id = ?').get(this.animal_id);
        if (!animalExiste) {
            throw new ContatoAnimalNaoEncontradoError(this.animal_id);
        }

        const stmt = db.prepare(`
            INSERT INTO contatos (remetente_id, animal_id, mensagem)
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(this.remetente_id, this.animal_id, this.mensagem.trim());
        this.id = info.lastInsertRowid;
        return this;
    }

    /**
     * Lista todos os contatos recebidos pelos animais de um determinado administrador.
     */
    static listarContatos(administradorId) {
        const linhas = db.prepare(`
            SELECT c.*,
                   a.nome as animal_nome,
                   u.nome as adotante_nome,
                   u.email as adotante_email,
                   u.telefone as adotante_telefone
            FROM contatos c
            JOIN animais a ON c.animal_id = a.id
            JOIN usuarios u ON c.remetente_id = u.id
            WHERE a.administrador_id = ?
            ORDER BY c.data_contato DESC
        `).all(administradorId);
        return linhas.map(Contato.fromRow);
    }

    /**
     * Atualiza o status deste contato (pendente, aprovado, recusado, visto).
     */
    atualizarStatusContato(novoStatus) {
        const statusValidos = ['pendente', 'aprovado', 'recusado', 'visto'];
        if (!statusValidos.includes(novoStatus)) {
            throw new StatusContatoInvalidoError(novoStatus);
        }

        const result = db.prepare('UPDATE contatos SET status = ? WHERE id = ?').run(novoStatus, this.id);
        if (result.changes === 0) {
            throw new ContatoNaoEncontradoError(this.id);
        }
        this.status = novoStatus;
        return this;
    }

    /** Converte uma linha do banco (objeto simples) em uma instância de Contato. */
    static fromRow(linha) {
        const contato = new Contato(
            linha.id, linha.remetente_id, linha.animal_id,
            linha.mensagem, linha.status, linha.data_contato
        );
        // campos extras vindos do JOIN (úteis na resposta da API, fora do diagrama)
        if (linha.animal_nome) contato.animal_nome = linha.animal_nome;
        if (linha.adotante_nome) contato.adotante_nome = linha.adotante_nome;
        if (linha.adotante_email) contato.adotante_email = linha.adotante_email;
        if (linha.adotante_telefone) contato.adotante_telefone = linha.adotante_telefone;
        return contato;
    }
}

/* ── Exceções personalizadas da entidade Contato ── */
class DadosContatoInvalidosError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'DadosContatoInvalidosError';
        this.statusCode = 400;
    }
}

class ContatoAnimalNaoEncontradoError extends Error {
    constructor(animalId) {
        super(`Animal com id ${animalId} não encontrado para registrar contato.`);
        this.name = 'ContatoAnimalNaoEncontradoError';
        this.statusCode = 404;
    }
}

class ContatoNaoEncontradoError extends Error {
    constructor(id) {
        super(`Contato com id ${id} não encontrado.`);
        this.name = 'ContatoNaoEncontradoError';
        this.statusCode = 404;
    }
}

class StatusContatoInvalidoError extends Error {
    constructor(status) {
        super(`Status "${status}" é inválido.`);
        this.name = 'StatusContatoInvalidoError';
        this.statusCode = 400;
    }
}

module.exports = {
    Contato,
    DadosContatoInvalidosError,
    ContatoAnimalNaoEncontradoError,
    ContatoNaoEncontradoError,
    StatusContatoInvalidoError
};