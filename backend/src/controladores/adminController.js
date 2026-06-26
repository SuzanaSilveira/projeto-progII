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
      

   // Deletar animal (com exclusão em cascata)
    deletarAnimal(req, res) {
    const { id } = req.params;
    
    try {
        // Primeiro, verifica se o animal existe
        const animal = db.prepare('SELECT * FROM animais WHERE id = ?').get(id);
        if (!animal) {
            return res.status(404).json({ erro: "Animal não encontrado" });
        }

        //  IMPORTANTE: Deleta os contatos (solicitações) relacionados primeiro
        const contatosDeletados = db.prepare('DELETE FROM contatos WHERE animal_id = ?').run(id);
        console.log(` ${contatosDeletados.changes} contatos deletados para o animal ${id}`);

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
    //Atualizar animal (admin pode atualizar qualquer campo, incluindo status)
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
        
        res.json({ 
            mensagem: "Animal atualizado com sucesso",
            success: true
        });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ erro: "Erro ao atualizar animal" });
    }
},
buscarAnimalPorId(req, res) {
    const { id } = req.params;
    
    try {
        const animal = db.prepare(`
            SELECT a.*, u.nome as administrador_nome 
            FROM animais a
            LEFT JOIN usuarios u ON a.administrador_id = u.id
            WHERE a.id = ?
        `).get(id);
        
        if (!animal) {
            return res.status(404).json({ erro: "Animal não encontrado" });
        }
        
        res.json({ success: true, animal });
    } catch (error) {
        console.error('Erro ao buscar animal:', error);
        res.status(500).json({ erro: "Erro ao buscar animal" });
    }
},
};

module.exports = adminController;