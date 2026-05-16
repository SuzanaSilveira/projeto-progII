const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'amigofiel.db'));

// Criar tabelas
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        telefone TEXT,
        cep TEXT,
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
`);

module.exports = db;
