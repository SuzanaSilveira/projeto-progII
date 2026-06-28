const { Animal, AnimalNaoEncontradoError, DadosAnimalInvalidosError } = require('../entidades/Animal');
const {
    Contato,
    ContatoNaoEncontradoError,
    StatusContatoInvalidoError
} = require('../entidades/Contato');

const adminController = {
    // ===== GERENCIAR ANIMAIS =====

    // Listar todos os animais (admin vê todos, incluindo indisponíveis)
    listarTodosAnimais(req, res) {
        try {
            const animais = Animal.listarPorAdministrador(req.usuario.id);
            res.json(animais);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao listar animais" });
        }
    },

    // Criar novo animal
    criarAnimal(req, res) {
        const { nome, especie, idade, porte, descricao, imagem_url } = req.body;

        try {
            const animal = new Animal(
                null, nome, especie, idade, porte, descricao, imagem_url, 'disponivel', req.usuario.id
            );
            animal.cadastrar();

            res.status(201).json({
                mensagem: "Animal cadastrado com sucesso",
                animal: { id: animal.id, nome: animal.nome, especie: animal.especie }
            });
        } catch (error) {
            if (error instanceof DadosAnimalInvalidosError) {
                return res.status(error.statusCode).json({ erro: error.message });
            }
            res.status(500).json({ erro: "Erro ao cadastrar animal" });
        }
    },

    // Deletar animal (com exclusão em cascata)
    deletarAnimal(req, res) {
        const { id } = req.params;

        try {
            const animal = Animal.buscarPorId(id);
            const { contatosRemovidos } = animal.deletar();

            res.json({
                mensagem: "Animal deletado com sucesso",
                contatos_removidos: contatosRemovidos
            });

        } catch (error) {
            if (error instanceof AnimalNaoEncontradoError) {
                return res.status(error.statusCode).json({ erro: error.message });
            }

            console.error('Erro ao deletar animal:', error);

            if (error.message.includes('FOREIGN KEY') || error.message.includes('constraint')) {
                return res.status(400).json({
                    erro: "Não é possível deletar este animal porque ele possui solicitações vinculadas"
                });
            }

            res.status(500).json({ erro: "Erro ao deletar animal" });
        }
    },

    // Atualizar animal (admin pode atualizar qualquer campo, incluindo status)
    atualizarAnimal(req, res) {
        const { id } = req.params;
        const { nome, especie, idade, porte, descricao, imagem_url, status } = req.body;

        try {
            const animal = Animal.buscarPorId(id);

            animal.nome = nome;
            animal.especie = especie;
            animal.idade = idade || null;
            animal.porte = porte || null;
            animal.descricao = descricao || null;
            animal.imagem_url = imagem_url || null;
            animal.status = status || 'disponivel';

            animal.atualizar();

            res.json({
                mensagem: "Animal atualizado com sucesso",
                success: true
            });
        } catch (error) {
            if (error instanceof AnimalNaoEncontradoError) {
                return res.status(error.statusCode).json({ erro: error.message });
            }

            console.error('Erro ao atualizar:', error);
            res.status(500).json({ erro: "Erro ao atualizar animal" });
        }
    },

    buscarAnimalPorId(req, res) {
        const { id } = req.params;

        try {
            const animal = Animal.buscarPorId(id);
            res.json({ success: true, animal });
        } catch (error) {
            if (error instanceof AnimalNaoEncontradoError) {
                return res.status(error.statusCode).json({ erro: error.message });
            }

            console.error('Erro ao buscar animal:', error);
            res.status(500).json({ erro: "Erro ao buscar animal" });
        }
    },

    listarTodosContatos(req, res) {
        try {
            const contatos = Contato.listarContatos(req.usuario.id);
            res.json({ success: true, contatos });
        } catch (error) {
            console.error('Erro ao listar contatos:', error);
            res.status(500).json({ erro: "Erro ao listar contatos" });
        }
    },

    // Atualizar status do contato
    atualizarStatusContato(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const contato = new Contato(id, null, null, null, null, null);
            contato.atualizarStatusContato(status);

            res.json({ success: true, mensagem: `Status atualizado para ${status}` });
        } catch (error) {
            if (error instanceof StatusContatoInvalidoError) {
                return res.status(error.statusCode).json({ erro: error.message });
            }
            if (error instanceof ContatoNaoEncontradoError) {
                return res.status(error.statusCode).json({ erro: error.message });
            }

            console.error('Erro ao atualizar status:', error);
            res.status(500).json({ erro: "Erro ao atualizar status" });
        }
    },
};

module.exports = adminController;