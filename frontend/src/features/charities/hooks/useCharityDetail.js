import { useQuery } from '@tanstack/react-query';
import { charitiesService } from '../charitiesService';

export const useCharityDetail = (slug) => {
  return useQuery({
    queryKey: ['charity', slug],
    queryFn: () => charitiesService.getCharityBySlug(slug),
    staleTime: 1000 * 60 * 10,
    enabled: !!slug,
    select: (data) => data.data,
  });
};