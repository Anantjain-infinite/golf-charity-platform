import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Charities', href: '/charities' },
    { label: 'How It Works', href: '/how-it-works' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(10, 10, 15, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="page-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px',
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              Golf Charity Club
            </Link>

            {/* Desktop Nav */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
              }}
              className="desktop-nav"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    color: isActive(link.href)
                      ? 'var(--color-primary)'
                      : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                  style={{ padding: '8px 20px', fontSize: '13px' }}
                >
                  Dashboard
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    to="/login"
                    style={{
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Sign In
                  </Link>
                  <Link to="/subscribe">
                    <button
                      className="btn-primary"
                      style={{ padding: '8px 20px', fontSize: '13px' }}
                    >
                      Subscribe
                    </button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                padding: '8px',
              }}
              className="mobile-menu-btn"
            >
              <div
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: 'currentColor',
                  marginBottom: '4px',
                  transition: 'all 0.2s',
                }}
              />
              <div
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: 'currentColor',
                  marginBottom: '4px',
                }}
              />
              <div
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: 'currentColor',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <div className="page-container" style={{ padding: '16px' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 0',
                      color: isActive(link.href)
                        ? 'var(--color-primary)'
                        : 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: 500,
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div style={{ paddingTop: '16px', display: 'flex', gap: '12px' }}>
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="btn-primary"
                      style={{ width: '100%' }}
                    >
                      Dashboard
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ flex: 1 }}
                      >
                        <button className="btn-secondary" style={{ width: '100%' }}>
                          Sign In
                        </button>
                      </Link>
                      <Link
                        to="/subscribe"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ flex: 1 }}
                      >
                        <button className="btn-primary" style={{ width: '100%' }}>
                          Subscribe
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: '48px 0',
          marginTop: '80px',
        }}
      >
        <div className="page-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              marginBottom: '40px',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: 'var(--color-primary)',
                  marginBottom: '12px',
                }}
              >
                Golf Charity Club
              </h3>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                }}
              >
                Play golf. Win prizes. Support charity. Every score you enter
                contributes to something bigger than the game.
              </p>
            </div>
            <div>
              <h4
                style={{
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '16px',
                }}
              >
                Platform
              </h4>
              {[
                { label: 'Charities', href: '/charities' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Subscribe', href: '/subscribe' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    display: 'block',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    marginBottom: '8px',
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div>
              <h4
                style={{
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '16px',
                }}
              >
                Account
              </h4>
              {[
                { label: 'Sign In', href: '/login' },
                { label: 'Create Account', href: '/signup' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    display: 'block',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    marginBottom: '8px',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '24px',
              color: 'var(--color-text-muted)',
              fontSize: '12px',
            }}
          >
            &copy; {new Date().getFullYear()} Golf Charity Club. All rights
            reserved. This platform operates in test mode.
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default PublicLayout;