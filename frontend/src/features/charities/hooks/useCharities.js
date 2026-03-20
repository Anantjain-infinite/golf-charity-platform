import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { charitiesService } from '../charitiesService';

export const useCharities = (searchTerm = '') => {
  return useInfiniteQuery({
    queryKey: ['charities', searchTerm],
    queryFn: ({ pageParam }) =>
      charitiesService.getCharities({ pageParam, search: searchTerm }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (!meta) return undefined;
      return meta.hasNextPage ? meta.page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
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