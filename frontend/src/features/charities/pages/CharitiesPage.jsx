import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCharities } from '../hooks/useCharities';
import { useDebounce } from '../../../hooks/useDebounce';
import InfiniteScrollTrigger from '../../../components/shared/InfiniteScrollTrigger';
import { formatCurrency } from '../../../utils/formatters';

const CharityCard = ({ charity }) => (
  <Link
    to={`/charities/${charity.slug}`}
    style={{ textDecoration: 'none' }}
  >
    <motion.div
      className="card-hover"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      {charity.is_featured && (
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(245,158,11,0.1)',
            color: 'var(--color-accent)',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '20px',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Featured
        </div>
      )}

      {charity.logo_url && (
        <img
          src={charity.logo_url}
          alt={charity.name}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            objectFit: 'cover',
            marginBottom: '12px',
          }}
        />
      )}

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '16px',
          color: 'var(--color-text-primary)',
          marginBottom: '8px',
        }}
      >
        {charity.name}
      </h3>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {charity.description}
      </p>

      <div
        style={{
          padding: '10px 14px',
          backgroundColor: 'var(--color-elevated)',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Raised
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '14px',
            color: 'var(--color-primary)',
          }}
        >
          {formatCurrency(charity.total_raised)}
        </span>
      </div>
    </motion.div>
  </Link>
);

const CharitiesPage = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCharities(debouncedSearch);

  const charities = data?.pages?.flatMap((page) => page.data || []) || [];
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="section-title" style={{ marginBottom: '8px' }}>
            Our Charities
          </h1>
          <p className="section-subtitle" style={{ marginBottom: '40px' }}>
            Every subscription contributes to these causes. Choose one to support.
          </p>

          {/* Search */}
          <div style={{ maxWidth: '400px', marginBottom: '40px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              placeholder="Search charities..."
            />
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
              Loading charities...
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-error)' }}>
              Failed to load charities. Please refresh.
            </div>
          )}

          {/* Grid */}
          {!isLoading && charities.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
              No charities found matching your search.
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '24px',
            }}
          >
            {charities.map((charity) => (
              <CharityCard key={charity.id} charity={charity} />
            ))}
          </div>

          <InfiniteScrollTrigger
            onIntersect={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CharitiesPage;