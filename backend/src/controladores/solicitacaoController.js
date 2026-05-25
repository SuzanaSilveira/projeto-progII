const db = require('../database/database.js');

const solicitacaoController = {
    // Criar solicitação de adoção
    async solicitar(req, res) {
        const { animal_id, adotante_id, mensagem } = req.body;

        try {
            const animal = db.prepare('SELECT * FROM animais WHERE id = ? AND status = ?').get(animal_id, 'disponivel');
            if (!animal) return res.status(404).json({ erro: 'Animal não disponível!' });

            const adotante = db.prepare('SELECT id FROM usuarios WHERE id = ?').get(adotante_id);
            if (!adotante) return res.status(404).json({ erro: 'Adotante não encontrado!' });

            const ja_existe = db.prepare("SELECT id FROM solicitacoes WHERE animal_id = ? AND status IN ('pendente', 'aprovada')").get(animal_id);
            if (ja_existe) return res.status(400).json({ erro: 'Já existe solicitação pendente!' });

            const result = db.prepare('INSERT INTO solicitacoes (animal_id, adotante_id, mensagem, status) VALUES (?, ?, ?, ?)').run(animal_id, adotante_id, mensagem, 'pendente');

            res.status(201).json({ ok: true, id: result.lastInsertRowid });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    },

    // Listar todas as solicitações
    async listarTodas(req, res) {
        try {
            const dados = db.prepare(`
                SELECT s.*, a.nome animal_nome, u_adotante.nome adotante_nome, u_doador.nome doador_nome
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_adotante ON s.adotante_id = u_adotante.id
                LEFT JOIN usuarios u_doador ON a.administrador_id = u_doador.id
                ORDER BY s.created_at DESC
            `).all();

            res.json({ ok: true, dados });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    },

    // Listar por status
    async listarPorStatus(req, res) {
        const { status } = req.params;

        try {
            const dados = db.prepare(`
                SELECT s.*, a.nome animal_nome, u_adotante.nome adotante_nome
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_adotante ON s.adotante_id = u_adotante.id
                WHERE s.status = ?
                ORDER BY s.created_at DESC
            `).all(status);

            res.json({ ok: true, dados });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    },

    // Listar por adotante
    async listarPorAdotante(req, res) {
        const { adotante_id } = req.params;

        try {
            const dados = db.prepare(`
                SELECT s.*, a.nome animal_nome, a.imagem_url
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                WHERE s.adotante_id = ?
                ORDER BY s.created_at DESC
            `).all(adotante_id);

            res.json({ ok: true, dados });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    },

    // Listar por doador
    async listarPorDoador(req, res) {
        const { doador_id } = req.params;

        try {
            const dados = db.prepare(`
                SELECT s.*, a.nome animal_nome, u_adotante.nome adotante_nome
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_adotante ON s.adotante_id = u_adotante.id
                WHERE a.administrador_id = ?
                ORDER BY s.created_at DESC
            `).all(doador_id);

            res.json({ ok: true, dados });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    },

    // Buscar por ID
    async buscarPorId(req, res) {
        const { id } = req.params;

        try {
            const dado = db.prepare(`
                SELECT s.*, a.nome animal_nome, u_adotante.nome adotante_nome, u_doador.nome doador_nome
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_adotante ON s.adotante_id = u_adotante.id
                LEFT JOIN usuarios u_doador ON a.administrador_id = u_doador.id
                WHERE s.id = ?
            `).get(id);

            if (dado) res.json({ ok: true, dado });
            else res.status(404).json({ erro: 'Não encontrado!' });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    },

    // Atualizar status
    async atualizarStatus(req, res) {
        const { id } = req.params;
        const { status, observacao } = req.body;

        try {
            const validos = ['pendente', 'aprovada', 'recusada', 'cancelada'];
            if (!validos.includes(status)) return res.status(400).json({ erro: 'Status inválido!' });

            const atual = db.prepare('SELECT * FROM solicitacoes WHERE id = ?').get(id);
            if (!atual) return res.status(404).json({ erro: 'Não encontrado!' });

            db.prepare('UPDATE solicitacoes SET status = ?, observacao = ? WHERE id = ?').run(status, observacao || null, id);

            // Atualiza animal se aprovado
            if (status === 'aprovada') db.prepare("UPDATE animais SET status = 'adotado' WHERE id = ?").run(atual.animal_id);

            res.json({ ok: true });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    },

    // Deletar
    async deletar(req, res) {
        const { id } = req.params;

        try {
            const result = db.prepare('DELETE FROM solicitacoes WHERE id = ?').run(id);
            if (result.changes > 0) res.json({ ok: true });
            else res.status(404).json({ erro: 'Não encontrado!' });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
};

module.exports = solicitacaoController;