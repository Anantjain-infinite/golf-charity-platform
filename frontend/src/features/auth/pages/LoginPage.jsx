import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '440px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              display: 'block',
              marginBottom: '24px',
            }}
          >
            Golf Charity Club
          </Link>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Form card */}
        <div className="card">
          <LoginForm />
        </div>

        {/* Test credentials hint */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: 'var(--color-elevated)',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}
          >
            Test Credentials
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            User: test@golfcharity.club / Test@2026!
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Admin: admin@golfcharity.club / Admin@2026!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;