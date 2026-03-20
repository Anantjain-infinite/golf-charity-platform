import { useScores } from '../hooks/useScores';
import ScoreItem from './ScoreItem';
import ScoreEntryForm from './ScoreEntryForm';
import { SCORE_MAX } from '../../../utils/constants';

const ScoreList = () => {
  const { data: scores, isLoading, error } = useScores();

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid var(--color-border)',
            borderTop: '2px solid var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: 'var(--color-error)',
          fontSize: '14px',
        }}
      >
        Failed to load scores. Please refresh.
      </div>
    );
  }

  const scoreCount = scores?.length || 0;
  const remaining = 5 - scoreCount;

  return (
    <div>
      {/* Entry form */}
      <div style={{ marginBottom: '28px' }}>
        <ScoreEntryForm />
      </div>

      {/* Score count info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '16px',
            color: 'var(--color-text-primary)',
          }}
        >
          Your Scores
        </h3>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
          }}
        >
          {scoreCount} / 5
        </span>
      </div>

      {/* Warning if less than 5 scores */}
      {remaining > 0 && scoreCount > 0 && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--color-warning)',
          }}
        >
          Add {remaining} more score{remaining > 1 ? 's' : ''} to qualify for the next draw.
        </div>
      )}

      {/* Empty state */}
      {scoreCount === 0 && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
            backgroundColor: 'var(--color-elevated)',
            borderRadius: '12px',
            border: '1px dashed var(--color-border)',
          }}
        >
          No scores yet. Add your first Stableford score above to get started.
        </div>
      )}

      {/* Score items */}
      {scores?.map((score, index) => (
        <ScoreItem key={score.id} score={score} index={index} />
      ))}

      {/* Visual bar chart */}
      {scoreCount > 0 && (
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              height: '60px',
              padding: '0 4px',
            }}
          >
            {scores.map((s, i) => (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  backgroundColor:
                    i === 0 ? 'var(--color-primary)' : 'rgba(110,231,183,0.3)',
                  borderRadius: '4px 4px 0 0',
                  height: `${(s.score / SCORE_MAX) * 100}%`,
                  minHeight: '4px',
                  transition: 'height 0.3s ease',
                }}
                title={`Score: ${s.score}`}
              />
            ))}
          </div>
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--color-border)',
              marginTop: '0',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ScoreList;