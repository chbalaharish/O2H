export default function TaskCard({ task, onStatusChange, onDelete }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'completed';
      case 'In Progress': return 'in-progress';
      default: return 'pending';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`task-card ${getStatusClass(task.status)}`} id={`task-card-${task.id}`}>
      <div>
        <div className="task-header">
          <h3 className="task-title" id={`task-title-${task.id}`}>{task.title}</h3>
          <span className={`task-badge ${getStatusClass(task.status)}`} id={`task-status-badge-${task.id}`}>
            {task.status}
          </span>
        </div>
        <p className="task-desc" id={`task-description-${task.id}`}>{task.description}</p>
      </div>

      <div className="task-footer">
        <span className="task-date" id={`task-date-${task.id}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {formatDate(task.created_at)}
        </span>

        <div className="task-actions">
          {task.status !== 'Completed' && (
            <button
              onClick={() => onStatusChange(task.id, 'Completed')}
              className="btn btn-success-text btn-icon"
              title="Complete Task"
              aria-label="Complete Task"
              id={`complete-task-btn-${task.id}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          )}
          
          {task.status === 'Pending' && (
            <button
              onClick={() => onStatusChange(task.id, 'In Progress')}
              className="btn btn-outline btn-icon"
              title="Start Task"
              aria-label="Start Task"
              id={`start-task-btn-${task.id}`}
              style={{ padding: '0.4rem', color: 'var(--info-color)', borderColor: 'rgba(14, 165, 233, 0.2)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-danger btn-icon"
            title="Delete Task"
            aria-label="Delete Task"
            id={`delete-task-btn-${task.id}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
