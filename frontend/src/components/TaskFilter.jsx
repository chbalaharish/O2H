export default function TaskFilter({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy
}) {
  const statuses = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];

  return (
    <div className="controls-bar" id="controls-bar-container">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          id="search-tasks-input"
        />
      </div>

      {/* Status Filters */}
      <div className="filter-group" id="status-filter-group">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => setStatusFilter(status.value)}
            className={`filter-btn ${statusFilter === status.value ? 'active' : ''}`}
            id={`filter-btn-${status.label.toLowerCase().replace(' ', '-')}`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Sorting Dropdown */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
        id="sort-tasks-select"
      >
        <option value="created_at:desc">Newest First</option>
        <option value="created_at:asc">Oldest First</option>
        <option value="title:asc">Title (A-Z)</option>
        <option value="title:desc">Title (Z-A)</option>
      </select>
    </div>
  );
}
