import { useDrawHistory } from '../../draws/hooks/useDrawHistory';
import InfiniteScrollTrigger from '../../../components/shared/InfiniteScrollTrigger';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatMonth, formatCurrency } from '../../../utils/formatters';

const MatchBadge = ({ matchCount }) => {
  if (matchCount === 5) return <span className="badge-paid">Jackpot</span>;
  if (matchCount === 4) return <span className="badge-approved">4 Match</span>;
  if (matchCount === 3) return <span className="badge-pending">3 Match</span>;
  return <span className="badge-inactive">No Match</span>;
};

const DrawHistoryTab = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDrawHistory();

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading draw history...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-error)' }}>
        Failed to load draw history.
      </div>
    );
  }

  const entries = data?.pages?.flatMap((page) => page.data) || [];

  if (entries.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          You have not been entered into any draws yet. Subscribe and add scores to participate.
        </p>
      </div>
    );
  }

  return (
    <div>
      {entries.map((entry) => {
        const drawnNumbers = entry.draws?.drawn_numbers || [];
        const userScores = entry.submitted_scores || [];
        const drawnSet = new Set(drawnNumbers);

        return (
          <div
            key={entry.id}
            className="card"
            style={{ marginBottom: '16px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '16px', marginBottom: '4px' }}>
                  {formatMonth(entry.draws?.draw_month)}
                </div>
                <MatchBadge matchCount={entry.match_count} />
              </div>
              {entry.is_winner && entry.prize_amount && (
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                  }}
                >
                  {formatCurrency(entry.prize_amount)}
                </div>
              )}
            </div>

            {/* Numbers comparison */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Drawn Numbers
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {drawnNumbers.map((n) => (
                    <span
                      key={n}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(245,158,11,0.1)',
                        color: 'var(--color-accent)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Your Scores
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {userScores.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: drawnSet.has(s)
                          ? 'rgba(110,231,183,0.15)'
                          : 'var(--color-elevated)',
                        color: drawnSet.has(s)
                          ? 'var(--color-primary)'
                          : 'var(--color-text-muted)',
                        border: drawnSet.has(s)
                          ? '1px solid rgba(110,231,183,0.4)'
                          : '1px solid var(--color-border)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <InfiniteScrollTrigger
        onIntersect={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};

export default DrawHistoryTab;