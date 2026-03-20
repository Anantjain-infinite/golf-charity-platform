import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { charitiesService } from '../charitiesService';

export const useCharities = (searchTerm = '') => {
  return useInfiniteQuery({
    queryKey: ['charities', searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      charitiesService.getCharities({ pageParam, search: searchTerm }),
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedCharity = () => {
  return useQuery({
    queryKey: ['charities', 'featured'],
    queryFn: charitiesService.getFeaturedCharity,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });
};