import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { TaskService } from '../services/tasks.js';
import DashboardStats from '../components/DashboardStats.jsx';
import TaskFilter from '../components/TaskFilter.jsx';
import TaskCard from '../components/TaskCard.jsx';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Search/Filter/Pagination States
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at:desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  // Handle flash messages
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear history state to avoid showing message again on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page to 1 on search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Stats and Tasks
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksData, statsData] = await Promise.all([
        TaskService.getTasks({
          status: statusFilter,
          search: debouncedSearch,
          sort: sortBy,
          page,
          limit: 6
        }),
        TaskService.getStats()
      ]);

      setTasks(tasksData.tasks);
      setTotalPages(tasksData.totalPages);
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, sortBy, page]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Status Update
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      setMessage(`Task status updated to "${newStatus}" successfully.`);
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task status.');
    }
  };

  // Handle Delete
  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await TaskService.deleteTask(taskId);
        setMessage('Task deleted successfully.');
        loadDashboardData();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete task.');
      }
    }
  };

  return (
    <div className="dashboard-page" id="dashboard-page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Project Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your tasks</p>
        </div>
      </div>

      {message && (
        <div className="alert-banner success" id="dashboard-success-banner" style={{ position: 'relative' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{message}</span>
          <button 
            onClick={() => setMessage('')} 
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="alert-banner error" id="dashboard-error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {/* Statistics */}
      <DashboardStats stats={stats} />

      {/* Filters & Search Controls */}
      <TaskFilter
        statusFilter={statusFilter}
        setStatusFilter={(val) => { setStatusFilter(val); setPage(1); }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={(val) => { setSortBy(val); setPage(1); }}
      />

      {/* Main Grid / Loader / Empty State */}
      {loading ? (
        <div className="loader-container" id="dashboard-loader">
          <div className="spinner"></div>
          <p className="loader-text">Loading dashboard tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state" id="dashboard-empty-state">
          <div className="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="11" y2="17"></line>
            </svg>
          </div>
          <h3 className="empty-state-title">No tasks found</h3>
          <p className="empty-state-desc">
            {debouncedSearch || statusFilter
              ? "No tasks match your filter criteria. Try adjusting your filters."
              : "You haven't created any tasks yet. Get started by creating your first task!"}
          </p>
        </div>
      ) : (
        <>
          <div className="tasks-grid" id="tasks-grid-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination" id="dashboard-pagination">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="pagination-btn"
                id="pagination-prev-btn"
                aria-label="Previous Page"
              >
                &laquo;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`pagination-btn ${page === p ? 'active' : ''}`}
                  id={`pagination-page-btn-${p}`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="pagination-btn"
                id="pagination-next-btn"
                aria-label="Next Page"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
