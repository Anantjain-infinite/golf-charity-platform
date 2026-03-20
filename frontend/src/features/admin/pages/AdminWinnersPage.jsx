import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminService } from '../adminService';
import StatusBadge from '../../../components/shared/StatusBadge';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { formatCurrency, formatDate, formatMonth } from '../../../utils/formatters';

const AdminWinnersPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'claims', statusFilter],
    queryFn: () => adminService.getClaims({ status: statusFilter }),
    staleTime: 1000 * 30,
    refetchOnMount: true,
  });

  const { mutate: updateClaim, isPending } = useMutation({
    mutationFn: adminService.updateClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'claims'] });
      toast.success('Claim updated.');
      setConfirmAction(null);
      setSelectedClaim(null);
      setAdminNote('');
    },
    onError: () => toast.error('Failed to update claim.'),
  });

  const claims = data?.data || [];

  const handleAction = (claim, status) => {
    setConfirmAction({ claim, status });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          Winners
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Review prize claims and manage payouts.
        </p>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '24px' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
          style={{ maxWidth: '200px' }}
        >
          <option value="">All claims</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-text-muted)', padding: '40px', textAlign: 'center' }}>Loading claims...</div>
      ) : claims.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No claims found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {claims.map((claim) => (
            <div key={claim.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '16px', marginBottom: '4px' }}>
                    {claim.profiles?.full_name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    {claim.profiles?.email} — {formatMonth(claim.draw_entries?.draws?.draw_month)}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <StatusBadge status={claim.status} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-accent)', fontSize: '16px' }}>
                      {formatCurrency(claim.draw_entries?.prize_amount)}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Submitted {formatDate(claim.submitted_at)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedClaim(claim)}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '13px' }}
                  >
                    {claim.proof_url ? 'View Proof' : 'Details'}
                  </button>
                  {claim.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(claim, 'approved')}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(claim, 'rejected')}
                        className="btn-danger"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {claim.status === 'approved' && (
                    <button
                      onClick={() => handleAction(claim, 'paid')}
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '13px', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>

              {claim.admin_note && (
                <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: 'var(--color-elevated)', borderRadius: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  Note: {claim.admin_note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Proof viewer modal */}
      {selectedClaim && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={() => setSelectedClaim(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)' }} />
          <div className="card" style={{ position: 'relative', zIndex: 10, maxWidth: '560px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
              Claim — {selectedClaim.profiles?.full_name}
            </h2>
            {selectedClaim.proof_url ? (
              <img
                src={selectedClaim.proof_url}
                alt="Proof"
                style={{ width: '100%', borderRadius: '10px', marginBottom: '16px' }}
              />
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-elevated)', borderRadius: '10px', marginBottom: '16px' }}>
                No proof uploaded yet.
              </div>
            )}
            <button onClick={() => setSelectedClaim(null)} className="btn-secondary" style={{ width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Action confirm modal */}
      {confirmAction && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={() => setConfirmAction(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />
          <div className="card" style={{ position: 'relative', zIndex: 10, maxWidth: '440px', width: '100%' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
              {confirmAction.status === 'approved' ? 'Approve Claim' : confirmAction.status === 'rejected' ? 'Reject Claim' : 'Mark as Paid'}
            </h2>
            {confirmAction.status === 'rejected' && (
              <div style={{ marginBottom: '16px' }}>
                <label className="label">Reason (optional)</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="Reason for rejection..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setConfirmAction(null); setAdminNote(''); }} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                Cancel
              </button>
              <button
                onClick={() => updateClaim({ id: confirmAction.claim.id, status: confirmAction.status, admin_note: adminNote || undefined })}
                disabled={isPending}
                className={confirmAction.status === 'rejected' ? 'btn-danger' : 'btn-primary'}
                style={{ padding: '10px 20px', fontSize: '14px' }}
              >
                {isPending ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminWinnersPage;