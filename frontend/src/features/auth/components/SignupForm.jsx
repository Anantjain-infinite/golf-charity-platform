import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useAuth';

const schema = yup.object({
  full_name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const SignupForm = () => {
  const { mutate: signup, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = ({ full_name, email, password }) =>
    signup({ full_name, email, password });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom: '20px' }}>
        <label className="label">Full Name</label>
        <input
          {...register('full_name')}
          type="text"
          className="input"
          placeholder="Your full name"
          autoComplete="name"
        />
        {errors.full_name && (
          <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
            {errors.full_name.message}
          </p>
        )}
      </div>

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

      <div style={{ marginBottom: '20px' }}>
        <label className="label">Password</label>
        <input
          {...register('password')}
          type="password"
          className="input"
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
        />
        {errors.password && (
          <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label className="label">Confirm Password</label>
        <input
          {...register('confirm_password')}
          type="password"
          className="input"
          placeholder="Repeat your password"
          autoComplete="new-password"
        />
        {errors.confirm_password && (
          <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '6px' }}>
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={isPending}
        style={{ width: '100%', padding: '14px' }}
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>

      <p
        style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'var(--color-text-muted)',
          fontSize: '14px',
        }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;