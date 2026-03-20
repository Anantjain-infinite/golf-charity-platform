import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { claimsService } from '../claimsService';

const CLAIMS_KEY = ['claims'];

export const useClaims = () => {
  return useQuery({
    queryKey: CLAIMS_KEY,
    queryFn: claimsService.getMyClaims,
    staleTime: 1000 * 60,
  });
};

export const useSubmitProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimsService.submitProof,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAIMS_KEY });
      toast.success('Proof uploaded successfully. Your claim is under review.');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to upload proof';
      toast.error(message);
    },
  });
};