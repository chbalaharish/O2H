import { getDB } from '../config/db.js';

export const TaskModel = {
  async create({ userId, title, description, status = 'Pending' }) {
    const db = await getDB();
    const result = await db.run(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, description, status]
    );
    return this.findById(result.lastID, userId);
  },

  async findById(id, userId) {
    const db = await getDB();
    return db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
  },

  async findAll(userId, { status, search, sort = 'created_at:desc', limit = 10, offset = 0 } = {}) {
    const db = await getDB();
    
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    let countQuery = 'SELECT COUNT(*) as count FROM tasks WHERE user_id = ?';
    const params = [userId];
    const countParams = [userId];

    if (status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    if (search) {
      const searchPattern = `%${search}%`;
      query += ' AND (title LIKE ? OR description LIKE ?)';
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern);
    }

    // Sorting Whitelist to prevent SQL Injection
    const [sortField, sortOrder] = sort.split(':');
    const allowedFields = ['created_at', 'title', 'status'];
    const allowedOrders = ['asc', 'desc', 'ASC', 'DESC'];
    
    const field = allowedFields.includes(sortField) ? sortField : 'created_at';
    const order = allowedOrders.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC';
    
    query += ` ORDER BY ${field} ${order}`;

    // Pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [tasks, totalResult] = await Promise.all([
      db.all(query, params),
      db.get(countQuery, countParams)
    ]);

    return {
      tasks,
      totalCount: totalResult ? totalResult.count : 0
    };
  },

  async updateStatus(id, userId, status) {
    const db = await getDB();
    await db.run(
      'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
      [status, id, userId]
    );
    return this.findById(id, userId);
  },

  async delete(id, userId) {
    const db = await getDB();
    const result = await db.run(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.changes > 0;
  },

  async getStats(userId) {
    const db = await getDB();
    const rows = await db.all(
      'SELECT status, COUNT(*) as count FROM tasks WHERE user_id = ? GROUP BY status',
      [userId]
    );

    const stats = {
      total: 0,
      Pending: 0,
      'In Progress': 0,
      Completed: 0
    };

    rows.forEach(row => {
      stats[row.status] = row.count;
      stats.total += row.count;
    });

    return stats;
  }
};
