/* ════════════════════════════════════════════
   favoritoController.js
   Usa as classes do modelo para garantir
   validação antes de persistir no banco
════════════════════════════════════════════ */

const db = require('../database/database.js');
const { Favorito, ListaDeFavoritos, FavoritoException } = require('../models/Favorito');

const favoritoController = {

  /* Adiciona animal aos favoritos do usuário */
  adicionar(req, res) {
    const { usuario_id, animal_id } = req.body;
    let favorito = null;

    try {
      /* Instancia a classe — validação acontece no construtor */
      favorito = new Favorito(Number(usuario_id), Number(animal_id));

      /* Verifica se o animal existe */
      const animal = db.prepare('SELECT id FROM animais WHERE id = ?').get(favorito.animalId);
      if (!animal) throw new FavoritoException('Animal não encontrado.');

      /* Persiste no banco */
      const result = db.prepare(
        'INSERT INTO favoritos (usuario_id, animal_id) VALUES (?, ?)'
      ).run(favorito.usuarioId, favorito.animalId);

      res.status(201).json({ success: true, id: result.lastInsertRowid });

    } catch (error) {
      /* Trata UNIQUE constraint (já favoritado) */
      if (error.message.includes('UNIQUE')) {
        return res.status(409).json({ success: false, message: 'Animal já está nos favoritos.' });
      }
      /* Trata exceções do modelo */
      if (error instanceof FavoritoException) {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });

    } finally {
      /* Log de auditoria — sempre executado */
      console.log(`[Favorito] usuario=${usuario_id} animal=${animal_id} — ${new Date().toISOString()}`);
    }
  },

  /* Remove animal dos favoritos */
  remover(req, res) {
    const { usuario_id, animal_id } = req.params;

    try {
      const result = db.prepare(
        'DELETE FROM favoritos WHERE usuario_id = ? AND animal_id = ?'
      ).run(Number(usuario_id), Number(animal_id));

      if (result.changes === 0) throw new FavoritoException('Favorito não encontrado.');

      res.json({ success: true, message: 'Removido dos favoritos.' });

    } catch (error) {
      if (error instanceof FavoritoException) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });

    } finally {
      console.log(`[Favorito removido] usuario=${usuario_id} animal=${animal_id}`);
    }
  },

  /* Lista favoritos de um usuário usando ListaDeFavoritos */
  listarPorUsuario(req, res) {
    const { usuario_id } = req.params;

    try {
      const rows = db.prepare(`
                SELECT f.id, f.data_favoritado,
                       a.id AS animal_id, a.nome, a.especie, a.porte, a.idade, a.imagem_url, a.status
                FROM favoritos f
                LEFT JOIN animais a ON f.animal_id = a.id
                WHERE f.usuario_id = ?
                ORDER BY f.data_favoritado DESC
            `).all(Number(usuario_id));

      /* Monta a ListaDeFavoritos com os dados do banco */
      const lista = new ListaDeFavoritos();
      rows.forEach(row => {
        const fav = new Favorito(Number(usuario_id), row.animal_id);
        lista.adicionar(fav);
      });

      res.json({ success: true, total: lista.total, favoritos: rows });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /* Verifica se um animal específico já é favorito */
  verificar(req, res) {
    const { usuario_id, animal_id } = req.params;
    try {
      const existe = db.prepare(
        'SELECT id FROM favoritos WHERE usuario_id = ? AND animal_id = ?'
      ).get(Number(usuario_id), Number(animal_id));

      res.json({ success: true, favoritado: !!existe });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = favoritoController;