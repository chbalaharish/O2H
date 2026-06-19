export default function DashboardStats({ stats }) {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats?.total || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      colorClass: 'stat-total',
      style: { backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }
    },
    {
      label: 'Pending',
      value: stats?.Pending || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      colorClass: 'stat-pending',
      style: { backgroundColor: 'var(--warning-light)', color: 'var(--warning-color)' }
    },
    {
      label: 'In Progress',
      value: stats?.['In Progress'] || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      colorClass: 'stat-progress',
      style: { backgroundColor: 'var(--info-light)', color: 'var(--info-color)' }
    },
    {
      label: 'Completed',
      value: stats?.Completed || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      colorClass: 'stat-completed',
      style: { backgroundColor: 'var(--success-light)', color: 'var(--success-color)' }
    }
  ];

  return (
    <div className="stats-grid" id="stats-grid-container">
      {statItems.map((item, idx) => (
        <div key={idx} className="stat-card" id={`stat-card-${item.label.toLowerCase().replace(' ', '-')}`}>
          <div className="stat-icon-wrapper" style={item.style}>
            {item.icon}
          </div>
          <div className="stat-info">
            <span className="stat-value">{item.value}</span>
            <span className="stat-label">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
