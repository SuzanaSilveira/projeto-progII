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

    CREATE TABLE IF NOT EXISTS preferencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        especie_pref TEXT,
        porte_pref TEXT,
        idade_min INTEGER,
        idade_max INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
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

    -- 🆕 Tabela para recuperação de senha (opcional, mas útil)
    CREATE TABLE IF NOT EXISTS recuperacao_senha (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        token TEXT NOT NULL,
        expira_em DATETIME NOT NULL,
        usado INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
`);

console.log('✅ Banco de dados inicializado com sucesso!');

module.exports = db;