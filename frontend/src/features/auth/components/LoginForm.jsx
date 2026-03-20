import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';

const schema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (values) => login(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom: '20px' }}>
        <label className="label">Email Address</label>
        <input
          {...register('email')}
          type="email"
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email && (
          <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label className="label">Password</label>
        <input
          {...register('password')}
          type="password"
          className="input"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        {errors.password && (
          <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={isPending}
        style={{ width: '100%', padding: '14px' }}
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>

      <p
        style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'var(--color-text-muted)',
          fontSize: '14px',
        }}
      >
        No account yet?{' '}
        <Link
          to="/signup"
          style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
        >
          Create one
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;