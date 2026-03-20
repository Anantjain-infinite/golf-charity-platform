import { useState } from 'react';
import { useClaims, useSubmitProof } from '../../claims/hooks/useClaims';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatCurrency, formatDate, formatMonth } from '../../../utils/formatters';

const WinningsTab = () => {
  const { data, isLoading } = useClaims();
  const { mutate: submitProof, isPending: isUploading } = useSubmitProof();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingClaimId, setUploadingClaimId] = useState(null);

  const claims = data?.data || [];
  const totalWon = data?.totalWon || 0;

  const handleFileChange = (e, claimId) => {
    setSelectedFile(e.target.files[0]);
    setUploadingClaimId(claimId);
  };

  const handleUpload = (claimId) => {
    if (!selectedFile) return;
    submitProof(
      { claimId, file: selectedFile },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setUploadingClaimId(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading winnings...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Total won */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(110,231,183,0.05))',
          border: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          Total Won
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '36px',
            fontWeight: 700,
            color: 'var(--color-accent)',
          }}
        >
          {formatCurrency(totalWon)}
        </div>
      </div>

      {/* Claims list */}
      {claims.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            No prize claims yet. Win a draw to see your claims here.
          </p>
        </div>
      ) : (
        claims.map((claim) => (
          <div key={claim.id} className="card">
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
                  {formatMonth(claim.draw_entries?.draws?.draw_month)}
                </div>
                <StatusBadge status={claim.status} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                }}
              >
                {formatCurrency(claim.draw_entries?.prize_amount)}
              </div>
            </div>

            {/* Upload proof section */}
            {claim.status === 'pending' && !claim.proof_url && (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--color-elevated)',
                  borderRadius: '10px',
                  border: '1px dashed var(--color-border)',
                }}
              >
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  Upload a screenshot of your golf scores to claim your prize.
                </p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, claim.id)}
                    style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}
                  />
                  {selectedFile && uploadingClaimId === claim.id && (
                    <button
                      onClick={() => handleUpload(claim.id)}
                      disabled={isUploading}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Proof'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {claim.proof_url && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-success)' }}>
                Proof uploaded. Awaiting admin review.
              </div>
            )}

            {claim.admin_note && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {claim.admin_note}
              </div>
            )}

            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Submitted {formatDate(claim.submitted_at)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WinningsTab;