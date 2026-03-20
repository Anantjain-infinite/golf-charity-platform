import { useInfiniteQuery } from '@tanstack/react-query';
import { drawsService } from '../drawsService';

export const useDrawHistory = () => {
  return useInfiniteQuery({
    queryKey: ['draw-history'],
    queryFn: drawsService.getMyDrawEntries,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (!meta) return undefined;
      return meta.hasNextPage ? meta.page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 2,
  });
};