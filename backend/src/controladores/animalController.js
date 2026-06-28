const { Animal, AnimalNaoEncontradoError } = require('../entidades/Animal');
const {
    Contato,
    DadosContatoInvalidosError,
    ContatoAnimalNaoEncontradoError
} = require('../entidades/Contato');

const animalController = {

    listarDisponiveis(req, res) {
        try {
            const animais = Animal.listarDisponiveis();
            res.json({ success: true, animais });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    buscarPorId(req, res) {
        const { id } = req.params;
        try {
            const animal = Animal.buscarPorId(id);
            res.json({ success: true, animal });
        } catch (error) {
            if (error instanceof AnimalNaoEncontradoError) {
                return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    },

    registrarContato(req, res) {
        const { id } = req.params;
        const { remetente_id, mensagem } = req.body;

        try {
            const contato = new Contato(null, remetente_id, id, mensagem);
            contato.registrarContato();

            res.status(201).json({
                success: true,
                message: 'Interesse registrado com sucesso.',
                contato_id: contato.id
            });
        } catch (error) {
            if (error instanceof DadosContatoInvalidosError) {
                return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            if (error instanceof ContatoAnimalNaoEncontradoError) {
                return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = animalController;