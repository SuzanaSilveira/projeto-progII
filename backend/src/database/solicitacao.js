const db = require('./database.js');

const Solicitacao = {
    // Criar solicitação
    criar(animal_id, adotante_id, mensagem) {
        const stmt = db.prepare(`
            INSERT INTO solicitacoes (animal_id, adotante_id, mensagem, status)
            VALUES (?, ?, ?, 'pendente')
        `);
        const result = stmt.run(animal_id, adotante_id, mensagem);
        return result.lastInsertRowid;
    },

    // Buscar todas
    buscarTodas() {
        const stmt = db.prepare(`
            SELECT s.*, a.nome as animal_nome, u.nome as adotante_nome
            FROM solicitacoes s
            LEFT JOIN animais a ON s.animal_id = a.id
            LEFT JOIN usuarios u ON s.adotante_id = u.id
            ORDER BY s.created_at DESC
        `);
        return stmt.all();
    },

    // Buscar por ID
    buscarPorId(id) {
        const stmt = db.prepare('SELECT * FROM solicitacoes WHERE id = ?');
        return stmt.get(id);
    },

    // Buscar por animal
    buscarPorAnimal(animal_id) {
        const stmt = db.prepare('SELECT * FROM solicitacoes WHERE animal_id = ?');
        return stmt.all(animal_id);
    },

    // Buscar por adotante
    buscarPorAdotante(adotante_id) {
        const stmt = db.prepare('SELECT * FROM solicitacoes WHERE adotante_id = ?');
        return stmt.all(adotante_id);
    },

    // Atualizar status
    atualizarStatus(id, status, observacao = null) {
        const stmt = db.prepare(`
            UPDATE solicitacoes 
            SET status = ?, observacao = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        const result = stmt.run(status, observacao, id);
        return result.changes > 0;
    },

    // Deletar
    deletar(id) {
        const stmt = db.prepare('DELETE FROM solicitacoes WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
};

module.exports = Solicitacao;