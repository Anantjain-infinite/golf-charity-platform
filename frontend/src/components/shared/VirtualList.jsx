import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

const VirtualList = ({
  items,
  itemHeight = 60,
  renderItem,
  className = '',
  height = 600,
}) => {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;