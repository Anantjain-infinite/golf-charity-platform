import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../authService';
import { useAuthStore } from '../../../store/authStore';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const { token, user } = response.data;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.full_name}`);
      const redirect = searchParams.get('redirect') || '/dashboard';
      navigate(redirect, { replace: true });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || 'Invalid email or password';
      toast.error(message);
    },
  });
};

export const useSignup = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (response) => {
      const { token, user } = response.data;
      setAuth(user, token);
      toast.success(`Welcome to Golf Charity Club, ${user.full_name}`);
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || 'Failed to create account';
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      navigate('/login', { replace: true });
    },
  });
};