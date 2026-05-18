const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db = null;

async function getConnection() {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, '..', '..', 'database.sqlite'),
      driver: sqlite3.Database
    });
    
    // Criar tabelas se não existirem
    await initDatabase();
  }
  return db;
}

async function initDatabase() {
  const db = await getConnection();
  
  // Tabela de Animais
  await db.exec(`
    CREATE TABLE IF NOT EXISTS animais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      breed TEXT,
      age TEXT,
      size TEXT,
      gender TEXT,
      description TEXT,
      photo_url TEXT,
      vaccinated BOOLEAN DEFAULT 0,
      neutered BOOLEAN DEFAULT 0,
      temperament TEXT,
      special_needs TEXT,
      status TEXT DEFAULT 'disponível',
      donor_email TEXT NOT NULL,
      donor_name TEXT,
      donor_phone TEXT,
      donor_city TEXT,
      donor_state TEXT,
      donor_lat REAL,
      donor_lng REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Solicitações
  await db.exec(`
    CREATE TABLE IF NOT EXISTS solicitacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animal_id INTEGER NOT NULL,
      adopter_name TEXT NOT NULL,
      adopter_email TEXT NOT NULL,
      adopter_phone TEXT,
      adopter_city TEXT,
      adopter_state TEXT,
      adopter_address TEXT,
      has_other_pets BOOLEAN DEFAULT 0,
      has_children BOOLEAN DEFAULT 0,
      housing_type TEXT,
      motivation TEXT,
      request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pendente',
      status_observation TEXT,
      reviewed_by TEXT,
      reviewed_at DATETIME,
      notes TEXT,
      FOREIGN KEY (animal_id) REFERENCES animais(id) ON DELETE CASCADE
    )
  `);

  console.log(' Banco de dados inicializado');
}

module.exports = { getConnection };