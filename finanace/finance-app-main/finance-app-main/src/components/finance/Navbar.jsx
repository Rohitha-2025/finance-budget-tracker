import { NavLink } from 'react-router-dom';

// Navbar - Sidebar navigation for the finance app
function Navbar(props) {
  var pages = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-expense', path: '/add-expense', label: 'Add Expense', icon: '💸' },
    { id: 'add-income', path: '/add-income', label: 'Add Income', icon: '💰' },
    { id: 'budget', path: '/budget', label: 'Budget', icon: '🎯' },
    { id: 'reports', path: '/reports', label: 'Reports', icon: '📈' },
    { id: 'profile', path: '/profile', label: 'Profile', icon: '👤' },
  ];

  var user = props.user || {};
  var initials = (user.fullName || 'U').charAt(0).toUpperCase();
  var displayPhoto = user.photo;

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <h2>💳 FinTrack</h2>
        <small>Personal Finance</small>
      </div>

      <div className="user-profile-section">
        {displayPhoto ? (
          <img src={displayPhoto} alt={user.fullName} className="nav-profile-photo" />
        ) : (
          <div className="nav-profile-avatar">{initials}</div>
        )}
        <div className="user-info">
          <p className="user-name">{user.fullName || 'User'}</p>
          <p className="user-email">{user.email || 'No email'}</p>
        </div>
      </div>

      {pages.map(function (page) {
        return (
          <NavLink
            key={page.id}
            to={page.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{page.icon}</span>
            {page.label}
          </NavLink>
        );
      })}
      <button className="nav-item logout" onClick={props.onLogout}>
        <span className="nav-icon">🚪</span>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
