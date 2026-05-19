const db = require('../database/database.js');

const solicitacaoController = {
    // Criar nova solicitação de adoção
    solicitar(req, res) {
        const { animal_id, adotante_id, mensagem } = req.body;
        
        try {
            // Verificar se o animal existe e está disponível
            const animalStmt = db.prepare('SELECT * FROM animais WHERE id = ? AND status = ?');
            const animal = animalStmt.get(animal_id, 'disponivel');
            
            if (!animal) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Animal não encontrado ou já não está mais disponível!' 
                });
            }
            
            // Verificar se o adotante existe
            const adotanteStmt = db.prepare('SELECT id FROM usuarios WHERE id = ?');
            const adotante = adotanteStmt.get(adotante_id);
            
            if (!adotante) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Adotante não encontrado!' 
                });
            }
            
            // Verificar se já existe uma solicitação pendente para este animal
            const existenteStmt = db.prepare(`
                SELECT id FROM solicitacoes 
                WHERE animal_id = ? AND status IN ('pendente', 'aprovada')
            `);
            const existente = existenteStmt.get(animal_id);
            
            if (existente) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Já existe uma solicitação de adoção pendente para este animal!' 
                });
            }
            
            // Criar a solicitação
            const stmt = db.prepare(`
                INSERT INTO solicitacoes (animal_id, adotante_id, mensagem, status)
                VALUES (?, ?, ?, ?)
            `);
            
            const result = stmt.run(animal_id, adotante_id, mensagem, 'pendente');
            
            res.status(201).json({
                success: true,
                message: 'Solicitação de adoção enviada com sucesso!',
                id: result.lastInsertRowid
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Listar todas as solicitações (para administradores)
    listarTodas(req, res) {
        try {
            const stmt = db.prepare(`
                SELECT 
                    s.*,
                    a.nome as animal_nome,
                    a.especie as animal_especie,
                    a.porte as animal_porte,
                    u_adotante.nome as adotante_nome,
                    u_adotante.email as adotante_email,
                    u_adotante.telefone as adotante_telefone,
                    u_doador.nome as doador_nome,
                    u_doador.email as doador_email,
                    u_doador.telefone as doador_telefone
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_adotante ON s.adotante_id = u_adotante.id
                LEFT JOIN usuarios u_doador ON a.administrador_id = u_doador.id
                ORDER BY s.created_at DESC
            `);
            const solicitacoes = stmt.all();
            
            res.json({ success: true, solicitacoes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Listar solicitações por status
    listarPorStatus(req, res) {
        const { status } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT 
                    s.*,
                    a.nome as animal_nome,
                    a.especie as animal_especie,
                    a.idade as animal_idade,
                    a.porte as animal_porte,
                    u_adotante.nome as adotante_nome,
                    u_adotante.email as adotante_email,
                    u_adotante.telefone as adotante_telefone
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_adotante ON s.adotante_id = u_adotante.id
                WHERE s.status = ?
                ORDER BY s.created_at DESC
            `);
            const solicitacoes = stmt.all(status);
            
            res.json({ success: true, solicitacoes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Listar solicitações de um adotante específico
    listarPorAdotante(req, res) {
        const { adotante_id } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT 
                    s.*,
                    a.nome as animal_nome,
                    a.especie as animal_especie,
                    a.idade as animal_idade,
                    a.porte as animal_porte,
                    a.imagem_url as animal_imagem,
                    u_doador.nome as doador_nome,
                    u_doador.email as doador_email,
                    u_doador.telefone as doador_telefone
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_doador ON a.administrador_id = u_doador.id
                WHERE s.adotante_id = ?
                ORDER BY s.created_at DESC
            `);
            const solicitacoes = stmt.all(adotante_id);
            
            res.json({ success: true, solicitacoes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Listar solicitações de animais de um doador específico
    listarPorDoador(req, res) {
        const { doador_id } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT 
                    s.*,
                    a.nome as animal_nome,
                    a.especie as animal_especie,
                    a.idade as animal_idade,
                    a.porte as animal_porte,
                    u_adotante.nome as adotante_nome,
                    u_adotante.email as adotante_email,
                    u_adotante.telefone as adotante_telefone
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_adotante ON s.adotante_id = u_adotante.id
                WHERE a.administrador_id = ?
                ORDER BY s.created_at DESC
            `);
            const solicitacoes = stmt.all(doador_id);
            
            res.json({ success: true, solicitacoes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Buscar solicitação por ID
    buscarPorId(req, res) {
        const { id } = req.params;
        
        try {
            const stmt = db.prepare(`
                SELECT 
                    s.*,
                    a.nome as animal_nome,
                    a.especie as animal_especie,
                    a.idade as animal_idade,
                    a.porte as animal_porte,
                    a.descricao as animal_descricao,
                    a.imagem_url as animal_imagem,
                    u_adotante.nome as adotante_nome,
                    u_adotante.email as adotante_email,
                    u_adotante.telefone as adotante_telefone,
                    u_adotante.cep as adotante_cep,
                    u_doador.nome as doador_nome,
                    u_doador.email as doador_email,
                    u_doador.telefone as doador_telefone
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                LEFT JOIN usuarios u_adotante ON s.adotante_id = u_adotante.id
                LEFT JOIN usuarios u_doador ON a.administrador_id = u_doador.id
                WHERE s.id = ?
            `);
            const solicitacao = stmt.get(id);
            
            if (solicitacao) {
                res.json({ success: true, solicitacao });
            } else {
                res.status(404).json({ success: false, message: 'Solicitação não encontrada!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Atualizar status da solicitação (pendente/aprovada/recusada)
    atualizarStatus(req, res) {
        const { id } = req.params;
        const { status, observacao } = req.body;
        
        const statusValidos = ['pendente', 'aprovada', 'recusada', 'cancelada'];
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Status inválido! Use: pendente, aprovada, recusada ou cancelada' 
            });
        }
        
        try {
            // Buscar a solicitação antes de atualizar
            const buscarStmt = db.prepare(`
                SELECT s.*, a.administrador_id 
                FROM solicitacoes s
                LEFT JOIN animais a ON s.animal_id = a.id
                WHERE s.id = ?
            `);
            const solicitacao = buscarStmt.get(id);
            
            if (!solicitacao) {
                return res.status(404).json({ success: false, message: 'Solicitação não encontrada!' });
            }
            
            // Atualizar status da solicitação
            const stmt = db.prepare(`
                UPDATE solicitacoes 
                SET status = ?, observacao = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);
            
            const result = stmt.run(status, observacao || null, id);
            
            if (result.changes > 0) {
                // Se a solicitação foi aprovada, marcar o animal como adotado
                if (status === 'aprovada') {
                    const updateAnimalStmt = db.prepare(`
                        UPDATE animais 
                        SET status = 'adotado', updated_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                    `);
                    updateAnimalStmt.run(solicitacao.animal_id);
                }
                
                // Se foi recusada ou cancelada, manter animal disponível
                if (status === 'recusada' || status === 'cancelada') {
                    const updateAnimalStmt = db.prepare(`
                        UPDATE animais 
                        SET status = 'disponivel', updated_at = CURRENT_TIMESTAMP
                        WHERE id = ? AND status = 'adotado'
                    `);
                    updateAnimalStmt.run(solicitacao.animal_id);
                }
                
                res.json({ 
                    success: true, 
                    message: `Solicitação ${status === 'aprovada' ? 'aprovada' : status === 'recusada' ? 'recusada' : 'cancelada'} com sucesso!` 
                });
            } else {
                res.status(404).json({ success: false, message: 'Solicitação não encontrada!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Deletar solicitação (apenas administrativo)
    deletar(req, res) {
        const { id } = req.params;
        
        try {
            const stmt = db.prepare('DELETE FROM solicitacoes WHERE id = ?');
            const result = stmt.run(id);
            
            if (result.changes > 0) {
                res.json({ success: true, message: 'Solicitação deletada com sucesso!' });
            } else {
                res.status(404).json({ success: false, message: 'Solicitação não encontrada!' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Contar solicitações por status
    contarPorStatus(req, res) {
        try {
            const stmt = db.prepare(`
                SELECT 
                    status,
                    COUNT(*) as total
                FROM solicitacoes
                GROUP BY status
            `);
            const contagem = stmt.all();
            
            res.json({ success: true, contagem });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = solicitacaoController;