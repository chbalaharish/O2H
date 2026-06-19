import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskService } from '../services/tasks.js';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  
  // Validation States
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!title.trim()) {
      tempErrors.title = 'Task Title is required';
    }
    
    if (!description.trim()) {
      tempErrors.description = 'Description is required';
    } else if (description.trim().length < 20) {
      tempErrors.description = `Description must be at least 20 characters long (current length: ${description.trim().length} characters)`;
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await TaskService.createTask({
        title: title.trim(),
        description: description.trim(),
        status
      });
      navigate('/', { state: { message: 'Task created successfully!' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" id="add-task-container">
      <div className="form-header">
        <h2 className="form-title">Create New Task</h2>
        <p className="form-subtitle">Add a new task to your project board</p>
      </div>

      {error && (
        <div className="alert-banner error" id="add-task-error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} id="add-task-form">
        {/* Title field */}
        <div className="form-group">
          <label className="form-label" htmlFor="task-title">Task Title</label>
          <input
            type="text"
            id="task-title"
            placeholder="Enter task title"
            className={`form-input ${errors.title ? 'invalid' : ''}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            disabled={loading}
          />
          {errors.title && <span className="form-error" id="title-error">{errors.title}</span>}
        </div>

        {/* Description field */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label className="form-label" htmlFor="task-desc">Description</label>
            <span style={{ fontSize: '0.75rem', color: description.trim().length < 20 ? 'var(--warning-color)' : 'var(--success-color)' }}>
              {description.trim().length} / 20 min characters
            </span>
          </div>
          <textarea
            id="task-desc"
            placeholder="Provide details about this project task (minimum 20 characters)..."
            rows="5"
            className={`form-textarea ${errors.description ? 'invalid' : ''}`}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            disabled={loading}
          ></textarea>
          {errors.description && <span className="form-error" id="description-error">{errors.description}</span>}
        </div>

        {/* Status selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="task-status">Status</label>
          <select
            id="task-status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={loading}
            id="cancel-add-task-btn"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            id="submit-add-task-btn"
          >
            {loading ? <span className="spinner spinner-sm"></span> : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
