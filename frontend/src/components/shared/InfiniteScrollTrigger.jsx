import { useEffect, useRef } from 'react';

const InfiniteScrollTrigger = ({
  onIntersect,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onIntersect]);

  return (
    <div ref={ref} className="py-6 text-center">
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
          <span className="text-text-muted text-sm">Loading more...</span>
        </div>
      )}
      {!isFetchingNextPage && hasNextPage && (
        <span className="text-text-muted text-sm">Scroll for more</span>
      )}
    </div>
  );
};

export default InfiniteScrollTrigger;