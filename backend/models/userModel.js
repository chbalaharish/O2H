import { getDB } from '../config/db.js';

export const UserModel = {
  async findByUsername(username) {
    const db = await getDB();
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
  },

  async findById(id) {
    const db = await getDB();
    return db.get('SELECT id, username, created_at FROM users WHERE id = ?', [id]);
  },

  async create(username, passwordHash) {
    const db = await getDB();
    const result = await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, passwordHash]
    );
    return { id: result.lastID, username };
  }
};
