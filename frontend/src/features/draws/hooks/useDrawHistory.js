import { useInfiniteQuery } from '@tanstack/react-query';
import { drawsService } from '../drawsService';

export const useDrawHistory = () => {
  return useInfiniteQuery({
    queryKey: ['draw-history'],
    queryFn: drawsService.getMyDrawEntries,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 1000 * 60 * 2,
  });
};