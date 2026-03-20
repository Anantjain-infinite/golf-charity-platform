import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCharityDetail } from '../hooks/useCharityDetail';
import { formatCurrency } from '../../../utils/formatters';

const CharityDetailPage = () => {
  const { slug } = useParams();
  const { data: charity, isLoading, error } = useCharityDetail(slug);

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (error || !charity) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Charity not found.</p>
        <Link to="/charities">
          <button className="btn-secondary">Back to Charities</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Cover image */}
      {charity.cover_image_url && (
        <div
          style={{
            height: '280px',
            backgroundImage: `url(${charity.cover_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, var(--color-bg))',
            }}
          />
        </div>
      )}

      <div className="page-container" style={{ paddingTop: charity.cover_image_url ? '0' : '60px', paddingBottom: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back link */}
          <Link
            to="/charities"
            style={{
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '24px',
            }}
          >
            Back to Charities
          </Link>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            <div>
              {charity.logo_url && (
                <img
                  src={charity.logo_url}
                  alt={charity.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    marginBottom: '16px',
                  }}
                />
              )}

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '36px',
                  color: 'var(--color-text-primary)',
                  marginBottom: '16px',
                }}
              >
                {charity.name}
              </h1>

              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '16px',
                  lineHeight: 1.7,
                  marginBottom: '32px',
                  maxWidth: '600px',
                }}
              >
                {charity.description}
              </p>

              {charity.website_url && (
                <a
                  href={charity.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--color-primary)',
                    fontSize: '14px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Visit Website
                </a>
              )}
            </div>

            {/* Stats sidebar */}
            <div style={{ minWidth: '200px' }}>
              <div className="card" style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  Total Raised
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                  }}
                >
                  {formatCurrency(charity.total_raised)}
                </div>
              </div>

              <Link to={`/subscribe?charity=${charity.id}`}>
                <button className="btn-primary" style={{ width: '100%' }}>
                  Support This Charity
                </button>
              </Link>
            </div>
          </div>

          {/* Upcoming events */}
          {charity.upcoming_events && charity.upcoming_events.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '22px',
                  color: 'var(--color-text-primary)',
                  marginBottom: '20px',
                }}
              >
                Upcoming Events
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {charity.upcoming_events.map((event, i) => (
                  <div key={i} className="card">
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                      {event.name}
                    </div>
                    {event.date && (
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        {event.date}
                      </div>
                    )}
                    {event.description && (
                      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CharityDetailPage;