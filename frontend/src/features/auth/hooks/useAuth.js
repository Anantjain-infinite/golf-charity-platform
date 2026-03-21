import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../authService';
import { useAuthStore } from '../../../store/authStore';

import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const { token, user } = response.data;
      // Clear all cached queries before setting new auth
      // This prevents previous user's data from showing
      queryClient.clear();
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
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: authService.logout,
      onSettled: () => {
        queryClient.clear();
        logout();
        navigate('/login', { replace: true });
      },
    });
  };