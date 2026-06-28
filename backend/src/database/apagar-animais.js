const db = require('./database');

try {
  // Primeiro apaga os contatos
  db.prepare('DELETE FROM contatos').run();

  // Depois apaga os animais
  const info = db.prepare('DELETE FROM animais').run();

  // Reinicia os IDs
  db.prepare(`
        DELETE FROM sqlite_sequence
        WHERE name IN ('contatos', 'animais')
    `).run();

  console.log(`✅ ${info.changes} animais removidos com sucesso!`);
} catch (erro) {
  console.error('Erro:', erro.message);
}

db.close();