import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'D' },
  { label: 'Settings', href: '/settings', icon: 'S' },
];

const ADMIN_ITEMS = [
  { label: 'Overview', href: '/admin', icon: 'O' },
  { label: 'Users', href: '/admin/users', icon: 'U' },
  { label: 'Draws', href: '/admin/draws', icon: 'Dr' },
  { label: 'Charities', href: '/admin/charities', icon: 'C' },
  { label: 'Winners', href: '/admin/winners', icon: 'W' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'An' },
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const isActive = (href) =>
    href === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors — logout locally regardless
    }
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? ADMIN_ITEMS : NAV_ITEMS;

  return (
    <div
      style={{
        width: '240px',
        height: '100%',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <Link
          to={isAdmin ? '/admin' : '/dashboard'}
          onClick={onClose}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '16px',
            color: 'var(--color-primary)',
            textDecoration: 'none',
          }}
        >
          Golf Charity Club
        </Link>
        {isAdmin && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '11px',
              color: 'var(--color-accent)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Admin Panel
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '4px',
              textDecoration: 'none',
              backgroundColor: isActive(item.href)
                ? 'rgba(110, 231, 183, 0.1)'
                : 'transparent',
              color: isActive(item.href)
                ? 'var(--color-primary)'
                : 'var(--color-text-secondary)',
              fontWeight: isActive(item.href) ? 600 : 400,
              fontSize: '14px',
              transition: 'all 0.15s',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: isActive(item.href)
                  ? 'rgba(110, 231, 183, 0.15)'
                  : 'var(--color-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: isActive(item.href)
                  ? 'var(--color-primary)'
                  : 'var(--color-text-muted)',
              }}
            >
              {item.icon}
            </div>
            {item.label}
          </Link>
        ))}

        {/* Switch to admin/user link */}
        {isAdmin && (
          <Link
            to="/dashboard"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              marginTop: '16px',
              marginBottom: '4px',
              textDecoration: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '13px',
              borderTop: '1px solid var(--color-border)',
              paddingTop: '16px',
            }}
          >
            View as User
          </Link>
        )}
      </nav>

      {/* User info + logout */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '2px',
            }}
          >
            {user?.full_name || 'User'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ width: '100%', padding: '8px 16px', fontSize: '13px' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;