const db = require('../database/database'); 

const adminController = {
    // ===== GERENCIAR ANIMAIS =====
    
    // Listar todos os animais (admin vê todos, incluindo indisponíveis)
    listarTodosAnimais(req, res) {
    try {
        const animais = db.prepare(`
            SELECT a.*, u.nome as administrador_nome 
            FROM animais a
            LEFT JOIN usuarios u ON a.administrador_id = u.id
            WHERE a.administrador_id = ?
            ORDER BY a.created_at DESC
        `).all(req.usuario.id);
        
        res.json(animais);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar animais" });
    }
},
    
    // Criar novo animal
    criarAnimal(req, res) {
        const { nome, especie, idade, porte, descricao, imagem_url } = req.body;
        
        if (!nome || !especie) {
            return res.status(400).json({ erro: "Nome e espécie são obrigatórios" });
        }
        
        try {
            const stmt = db.prepare(`
                INSERT INTO animais (nome, especie, idade, porte, descricao, imagem_url, administrador_id, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'disponivel')
            `);
            
            const info = stmt.run(nome, especie, idade || null, porte || null, descricao || null, imagem_url || null, req.usuario.id);
            
            res.status(201).json({
                mensagem: "Animal cadastrado com sucesso",
                animal: { id: info.lastInsertRowid, nome, especie }
            });
        } catch (error) {
            res.status(500).json({ erro: "Erro ao cadastrar animal" });
        }
    },
    
    // Atualizar animal
    atualizarAnimal(req, res) {
        const { id } = req.params;
        const { nome, especie, idade, porte, descricao, imagem_url, status } = req.body;
        
        try {
            const stmt = db.prepare(`
                UPDATE animais 
                SET nome = ?, especie = ?, idade = ?, porte = ?, descricao = ?, imagem_url = ?, status = ?
                WHERE id = ?
            `);
            
            const result = stmt.run(nome, especie, idade || null, porte || null, descricao || null, imagem_url || null, status || 'disponivel', id);
            
            if (result.changes === 0) {
                return res.status(404).json({ erro: "Animal não encontrado" });
            }
            
            res.json({ mensagem: "Animal atualizado com sucesso" });
        } catch (error) {
            res.status(500).json({ erro: "Erro ao atualizar animal" });
        }
    },
    

   // Deletar animal (com exclusão em cascata)
deletarAnimal(req, res) {
    const { id } = req.params;
    
    try {
        // Primeiro, verifica se o animal existe
        const animal = db.prepare('SELECT * FROM animais WHERE id = ?').get(id);
        if (!animal) {
            return res.status(404).json({ erro: "Animal não encontrado" });
        }

        // 🔥 IMPORTANTE: Deleta os contatos (solicitações) relacionados primeiro
        const contatosDeletados = db.prepare('DELETE FROM contatos WHERE animal_id = ?').run(id);
        console.log(`🗑️ ${contatosDeletados.changes} contatos deletados para o animal ${id}`);

        // Depois deleta o animal
        const result = db.prepare('DELETE FROM animais WHERE id = ?').run(id);
        
        if (result.changes === 0) {
            return res.status(404).json({ erro: "Animal não encontrado" });
        }
        
        res.json({ 
            mensagem: "Animal deletado com sucesso",
            contatos_removidos: contatosDeletados.changes
        });
        
    } catch (error) {
        console.error('Erro ao deletar animal:', error);
        
        // Tratamento específico para erro de chave estrangeira
        if (error.message.includes('FOREIGN KEY') || error.message.includes('constraint')) {
            return res.status(400).json({ 
                erro: "Não é possível deletar este animal porque ele possui solicitações vinculadas" 
            });
        }
        
        res.status(500).json({ erro: "Erro ao deletar animal" });
    }
},
    
    // ===== GERENCIAR SOLICITAÇÕES =====
    
    // Listar todas as solicitações
    listarTodasSolicitacoes(req, res) {
        try {
            const solicitacoes = db.prepare(`
                SELECT s.*, 
                       a.nome as animal_nome,
                       u.nome as adotante_nome,
                       u.email as adotante_email,
                       u.telefone as adotante_telefone
                FROM contatos s
                JOIN animais a ON s.animal_id = a.id
                JOIN usuarios u ON s.remetente_id = u.id
                ORDER BY s.data_contato DESC
            `).all();
            
            res.json(solicitacoes);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao listar solicitações" });
        }
    },
    
    // Listar solicitações por status
    listarSolicitacoesPorStatus(req, res) {
        const { status } = req.params;
        
        try {
            const solicitacoes = db.prepare(`
                SELECT s.*, 
                       a.nome as animal_nome,
                       u.nome as adotante_nome,
                       u.email as adotante_email,
                       u.telefone as adotante_telefone
                FROM contatos s
                JOIN animais a ON s.animal_id = a.id
                JOIN usuarios u ON s.remetente_id = u.id
                WHERE s.status = ?
                ORDER BY s.data_contato DESC
            `).all(status);
            
            res.json(solicitacoes);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao listar solicitações" });
        }
    },
    
    // Atualizar status da solicitação (aprovar/rejeitar)
    atualizarStatusSolicitacao(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['pendente', 'aprovado', 'recusado'].includes(status)) {
            return res.status(400).json({ erro: "Status inválido" });
        }
        
        try {
            const result = db.prepare('UPDATE contatos SET status = ? WHERE id = ?').run(status, id);
            
            if (result.changes === 0) {
                return res.status(404).json({ erro: "Solicitação não encontrada" });
            }
            
            res.json({ mensagem: `Solicitação ${status === 'aprovado' ? 'aprovada' : 'recusada'} com sucesso` });
        } catch (error) {
            res.status(500).json({ erro: "Erro ao atualizar solicitação" });
        }
    },
    
    // Dashboard: contar animais por status
    contarAnimaisPorStatus(req, res) {
        try {
            const disponiveis = db.prepare("SELECT COUNT(*) as total FROM animais WHERE status = 'disponivel'").get();
            const adotados = db.prepare("SELECT COUNT(*) as total FROM animais WHERE status = 'adotado'").get();
            
            res.json({
                disponiveis: disponiveis.total,
                adotados: adotados.total
            });
        } catch (error) {
            res.status(500).json({ erro: "Erro ao contar animais" });
        }
    },
    
    // Dashboard: contar solicitações por status
    contarSolicitacoesPorStatus(req, res) {
        try {
            const pendentes = db.prepare("SELECT COUNT(*) as total FROM contatos WHERE status = 'pendente'").get();
            const aprovados = db.prepare("SELECT COUNT(*) as total FROM contatos WHERE status = 'aprovado'").get();
            const recusados = db.prepare("SELECT COUNT(*) as total FROM contatos WHERE status = 'recusado'").get();
            
            res.json({
                pendentes: pendentes.total,
                aprovados: aprovados.total,
                recusados: recusados.total
            });
        } catch (error) {
            res.status(500).json({ erro: "Erro ao contar solicitações" });
        }
    }
};

module.exports = adminController;