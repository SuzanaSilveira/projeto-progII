const { getConnection } = require('../database/connection');

class Animal {
  // Buscar todos os animais
  static async findAll(filters = {}) {
    const db = await getConnection();
    let query = 'SELECT * FROM animais';
    const params = [];
    
    if (filters.status) {
      query += ' WHERE status = ?';
      params.push(filters.status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    return await db.all(query, params);
  }

  // Buscar animal por ID
  static async findById(id) {
    const db = await getConnection();
    return await db.get('SELECT * FROM animais WHERE id = ?', id);
  }

  // Criar novo animal
  static async create(data) {
    const db = await getConnection();
    const {
      name, species, breed, age, size, gender, description,
      photo_url, vaccinated, neutered, temperament, special_needs,
      donor_email, donor_name, donor_phone, donor_city, donor_state,
      donor_lat, donor_lng
    } = data;

    const result = await db.run(
      `INSERT INTO animais (
        name, species, breed, age, size, gender, description,
        photo_url, vaccinated, neutered, temperament, special_needs,
        donor_email, donor_name, donor_phone, donor_city, donor_state,
        donor_lat, donor_lng, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, species, breed, age, size, gender, description,
        photo_url, vaccinated || 0, neutered || 0, temperament, special_needs,
        donor_email, donor_name, donor_phone, donor_city, donor_state,
        donor_lat, donor_lng, 'disponível'
      ]
    );
    
    return await this.findById(result.lastID);
  }

  // Atualizar animal
  static async update(id, data) {
    const db = await getConnection();
    const fields = [];
    const values = [];
    
    // Construir UPDATE dinamicamente
    const allowedFields = [
      'name', 'species', 'breed', 'age', 'size', 'gender', 'description',
      'photo_url', 'vaccinated', 'neutered', 'temperament', 'special_needs',
      'status', 'donor_email', 'donor_name', 'donor_phone', 'donor_city',
      'donor_state', 'donor_lat', 'donor_lng'
    ];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    if (fields.length === 0) return null;
    
    values.push(id);
    await db.run(
      `UPDATE animais SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return await this.findById(id);
  }

  // Deletar animal
  static async delete(id) {
    const db = await getConnection();
    const result = await db.run('DELETE FROM animais WHERE id = ?', id);
    return result.changes > 0;
  }

  // Buscar animais por doador
  static async findByDonorEmail(email) {
    const db = await getConnection();
    return await db.all('SELECT * FROM animais WHERE donor_email = ?', email);
  }
}

module.exports = Animal;