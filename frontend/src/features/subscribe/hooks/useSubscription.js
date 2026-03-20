import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { subscribeService } from '../subscribeService';

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: subscribeService.createCheckoutSession,
    onSuccess: (response) => {
      const url = response.data?.url;
      if (url) {
        window.location.href = url;
      }
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || 'Failed to start checkout';
      toast.error(message);
    },
  });
};