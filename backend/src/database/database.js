const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'amigofiel.db'));

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        telefone TEXT,
        tipo TEXT DEFAULT 'adotante',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS animais (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        especie TEXT NOT NULL,
        idade INTEGER,
        porte TEXT,
        descricao TEXT,
        imagem_url TEXT,
        status TEXT DEFAULT 'disponivel',
        administrador_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (administrador_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS contatos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        remetente_id INTEGER NOT NULL,
        animal_id INTEGER NOT NULL,
        mensagem TEXT NOT NULL,
        data_contato DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pendente',
        FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
        FOREIGN KEY (animal_id) REFERENCES animais(id)
    );

    CREATE TABLE IF NOT EXISTS favoritos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        animal_id INTEGER NOT NULL,
        data_favoritado DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (animal_id) REFERENCES animais(id),
        UNIQUE(usuario_id, animal_id)
    );

`);

console.log('✅ Banco de dados inicializado com sucesso!');

module.exports = db;