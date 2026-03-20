import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { scoresService } from '../scoresService';

const SCORES_KEY = ['scores'];

export const useScores = () => {
  return useQuery({
    queryKey: SCORES_KEY,
    queryFn: scoresService.getScores,
    staleTime: 1000 * 30,
    select: (data) => data.data,
  });
};

export const useAddScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scoresService.addScore,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: SCORES_KEY });
      const scores = response.scores || [];
      const wasRolled = scores.length === 5;
      if (wasRolled) {
        toast.success('Score saved. Oldest score was removed to keep your last 5.');
      } else {
        toast.success('Score saved successfully.');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to save score';
      toast.error(message);
    },
  });
};

export const useUpdateScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scoresService.updateScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCORES_KEY });
      toast.success('Score updated.');
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to update score';
      toast.error(message);
    },
  });
};

export const useDeleteScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scoresService.deleteScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCORES_KEY });
      toast.success('Score removed.');
    },
    onError: () => {
      toast.error('Failed to remove score.');
    },
  });
};