import { useState } from 'react';
import { useUpdateScore, useDeleteScore } from '../hooks/useScores';
import { formatDate } from '../../../utils/formatters';
import { SCORE_MIN, SCORE_MAX } from '../../../utils/constants';

const ScoreItem = ({ score, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editScore, setEditScore] = useState(score.score);
  const [editDate, setEditDate] = useState(score.played_date);
  const [editError, setEditError] = useState('');

  const { mutate: updateScore, isPending: isUpdating } = useUpdateScore();
  const { mutate: deleteScore, isPending: isDeleting } = useDeleteScore();

  const handleSave = () => {
    const val = Number(editScore);
    if (!val || val < SCORE_MIN || val > SCORE_MAX) {
      setEditError(`Score must be between ${SCORE_MIN} and ${SCORE_MAX}`);
      return;
    }
    if (!editDate) {
      setEditError('Date is required');
      return;
    }
    setEditError('');
    updateScore(
      { id: score.id, score: val, played_date: editDate },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    deleteScore(score.id);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        backgroundColor: 'var(--color-elevated)',
        borderRadius: '10px',
        marginBottom: '8px',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Rank number */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: index === 0 ? 'rgba(110,231,183,0.15)' : 'var(--color-surface)',
          color: index === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>

      {isEditing ? (
        <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="number"
            value={editScore}
            onChange={(e) => setEditScore(e.target.value)}
            className="input"
            style={{ width: '80px' }}
            min={SCORE_MIN}
            max={SCORE_MAX}
          />
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="input"
            style={{ width: '150px' }}
            max={new Date().toISOString().split('T')[0]}
          />
          {editError && (
            <p style={{ color: 'var(--color-error)', fontSize: '12px', width: '100%' }}>
              {editError}
            </p>
          )}
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}
          >
            {score.score}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {formatDate(score.played_date)}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditError('');
                setEditScore(score.score);
                setEditDate(score.played_date);
              }}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-danger"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {isDeleting ? '...' : 'Remove'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ScoreItem;