process.env.NODE_ENV = 'test';

import test from 'node:test';
import assert from 'node:assert';
import { TaskModel } from '../models/taskModel.js';
import { UserModel } from '../models/userModel.js';
import { initDB, getDB } from '../config/db.js';

test('Full Backend Logic Suite', async (t) => {
  let db;

  // Initialize the database before running tests
  t.before(async () => {
    await initDB();
    db = await getDB();
  });

  // Close the database after running tests
  t.after(async () => {
    if (db) {
      await db.close();
    }
  });

  await t.test('User Model - Register and Find User', async () => {
    const username = 'testuser';
    const passwordHash = 'hashed_password_12345';

    // Create user
    const newUser = await UserModel.create(username, passwordHash);
    assert.ok(newUser.id, 'User registration should return a new user ID');
    assert.strictEqual(newUser.username, username);

    // Find by username
    const foundUser = await UserModel.findByUsername(username);
    assert.ok(foundUser, 'Should find user by username');
    assert.strictEqual(foundUser.password, passwordHash, 'Hashed password should match');

    // Find by ID
    const foundById = await UserModel.findById(newUser.id);
    assert.ok(foundById, 'Should find user by ID');
    assert.strictEqual(foundById.username, username);
  });

  await t.test('Task Model - Create, Read, Update, Delete, and Stats', async () => {
    // 1. Create a user first for foreign key constraint
    const user = await UserModel.create('taskuser', 'hash');
    const userId = user.id;

    // 2. Create Tasks
    const task1 = await TaskModel.create({
      userId,
      title: 'Build Login API',
      description: 'Create endpoints for user signin and jwt token emission',
      status: 'Pending'
    });

    assert.ok(task1.id, 'Task creation should return a new task ID');
    assert.strictEqual(task1.title, 'Build Login API');
    assert.strictEqual(task1.status, 'Pending');
    assert.strictEqual(task1.user_id, userId);

    const task2 = await TaskModel.create({
      userId,
      title: 'Implement Dark Mode',
      description: 'Add body theme selectors for system toggle and storage retention',
      status: 'In Progress'
    });
    assert.ok(task2.id);

    // 3. Find All (Read) with filters
    const allTasks = await TaskModel.findAll(userId);
    assert.strictEqual(allTasks.totalCount, 2, 'Total tasks should be 2');
    assert.strictEqual(allTasks.tasks.length, 2);

    // Filter by status
    const pendingTasks = await TaskModel.findAll(userId, { status: 'Pending' });
    assert.strictEqual(pendingTasks.totalCount, 1);
    assert.strictEqual(pendingTasks.tasks[0].title, 'Build Login API');

    // Search tasks
    const searchResults = await TaskModel.findAll(userId, { search: 'Dark' });
    assert.strictEqual(searchResults.totalCount, 1);
    assert.strictEqual(searchResults.tasks[0].title, 'Implement Dark Mode');

    // 4. Update Status
    const updated = await TaskModel.updateStatus(task1.id, userId, 'Completed');
    assert.strictEqual(updated.status, 'Completed', 'Task status should update to Completed');

    // 5. Get Statistics
    const stats = await TaskModel.getStats(userId);
    assert.strictEqual(stats.total, 2);
    assert.strictEqual(stats.Completed, 1);
    assert.strictEqual(stats['In Progress'], 1);
    assert.strictEqual(stats.Pending, 0);

    // 6. Delete task
    const isDeleted = await TaskModel.delete(task1.id, userId);
    assert.strictEqual(isDeleted, true, 'Task deletion should return true');

    const remainingTasks = await TaskModel.findAll(userId);
    assert.strictEqual(remainingTasks.totalCount, 1, 'Total tasks count should decrement to 1');
  });
});
