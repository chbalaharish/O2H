import { TaskModel } from '../models/taskModel.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status = 'Pending' } = req.body;
    const userId = req.user.id; // set by authMiddleware

    // Server-side validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (!description || description.trim().length < 20) {
      return res.status(400).json({ error: 'Description must be at least 20 characters long' });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be one of: Pending, In Progress, Completed' });
    }

    const newTask = await TaskModel.create({
      userId,
      title: title.trim(),
      description: description.trim(),
      status
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error while creating task' });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, sort, page = 1, limit = 6 } = req.query;

    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    const offset = (pageNum - 1) * limitNum;

    const { tasks, totalCount } = await TaskModel.findAll(userId, {
      status,
      search,
      sort,
      limit: limitNum,
      offset
    });

    res.status(200).json({
      tasks,
      totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalCount / limitNum)
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error while fetching tasks' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be one of: Pending, In Progress, Completed' });
    }

    // Check if task exists and belongs to user
    const task = await TaskModel.findById(id, userId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await TaskModel.updateStatus(id, userId, status);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error while updating task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await TaskModel.delete(id, userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', id: parseInt(id, 10) });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error while deleting task' });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await TaskModel.getStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ error: 'Internal server error while fetching stats' });
  }
};
