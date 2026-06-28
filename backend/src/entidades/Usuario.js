const db = require('../database/database');

/**
 * Entidade Usuário
 * Representa um usuário do sistema (administrador ou adotante).
 * Atributos e métodos seguem o diagrama de classes do domínio.
 */
class Usuario {
    constructor(id, nome, email, senha, telefone, tipo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.tipo = tipo || 'adotante';
    }

    /**
     * Cadastra este usuário no banco de dados.
     * Lança erro se o email já estiver em uso.
     */
    cadastrar() {
        const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(this.email);
        if (existe) {
            throw new EmailJaCadastradoError(this.email);
        }

        const stmt = db.prepare(`
            INSERT INTO usuarios (nome, email, senha, telefone, tipo)
            VALUES (?, ?, ?, ?, ?)
        `);
        const info = stmt.run(this.nome, this.email, this.senha, this.telefone || null, this.tipo);
        this.id = info.lastInsertRowid;
        return this;
    }

    /**
     * Autentica um usuário por email e senha.
     * Método estático porque não depende de uma instância já existente.
     */
    static login(email, senha) {
        const linha = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

        if (!linha) {
            throw new CredenciaisInvalidasError();
        }
        if (linha.senha !== senha) {
            throw new CredenciaisInvalidasError();
        }

        return Usuario.fromRow(linha);
    }

    /**
     * Busca um usuário pelo id.
     */
    static buscarPorId(id) {
        const linha = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
        if (!linha) {
            throw new UsuarioNaoEncontradoError(id);
        }
        return Usuario.fromRow(linha);
    }

    /**
     * Atualiza os dados deste usuário no banco.
     */
    atualizar() {
        const stmt = db.prepare(`
            UPDATE usuarios
            SET nome = ?, email = ?, telefone = ?, tipo = ?
            WHERE id = ?
        `);
        const result = stmt.run(this.nome, this.email, this.telefone || null, this.tipo, this.id);

        if (result.changes === 0) {
            throw new UsuarioNaoEncontradoError(this.id);
        }
        return this;
    }

    /**
     * Remove este usuário do banco.
     */
    deletar() {
        const result = db.prepare('DELETE FROM usuarios WHERE id = ?').run(this.id);
        if (result.changes === 0) {
            throw new UsuarioNaoEncontradoError(this.id);
        }
        return true;
    }

    /** Gera o token simples (base64 de id:email) usado pela aplicação. */
    gerarToken() {
        return Buffer.from(`${this.id}:${this.email}`).toString('base64');
    }

    /** Verifica se este usuário tem permissão de administrador. */
    isAdmin() {
        return this.tipo === 'admin';
    }

    /** Converte uma linha do banco (objeto simples) em uma instância de Usuario. */
    static fromRow(linha) {
        return new Usuario(linha.id, linha.nome, linha.email, linha.senha, linha.telefone, linha.tipo);
    }

    /** Versão sem a senha, segura para devolver nas respostas da API. */
    toPublicJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            telefone: this.telefone,
            tipo: this.tipo
        };
    }
}

/* ── Exceções personalizadas da entidade Usuário ── */
class EmailJaCadastradoError extends Error {
    constructor(email) {
        super(`O e-mail "${email}" já está cadastrado.`);
        this.name = 'EmailJaCadastradoError';
        this.statusCode = 400;
    }
}

class CredenciaisInvalidasError extends Error {
    constructor() {
        super('Email ou senha incorretos.');
        this.name = 'CredenciaisInvalidasError';
        this.statusCode = 401;
    }
}

class UsuarioNaoEncontradoError extends Error {
    constructor(id) {
        super(`Usuário com id ${id} não encontrado.`);
        this.name = 'UsuarioNaoEncontradoError';
        this.statusCode = 404;
    }
}

module.exports = { Usuario, EmailJaCadastradoError, CredenciaisInvalidasError, UsuarioNaoEncontradoError };