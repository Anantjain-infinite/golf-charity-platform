import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
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
            Create your account
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Join and start supporting charity through golf
          </p>
        </div>

        {/* Form card */}
        <div className="card">
          <SignupForm />
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;