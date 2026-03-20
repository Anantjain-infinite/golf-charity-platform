import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminService } from '../adminService';
import StatusBadge from '../../../components/shared/StatusBadge';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { formatMonth, formatCurrency } from '../../../utils/formatters';

const AdminDrawsPage = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [drawMonth, setDrawMonth] = useState('');
  const [drawType, setDrawType] = useState('random');
  const [algorithmMode, setAlgorithmMode] = useState('frequent');
  const [simulationResult, setSimulationResult] = useState(null);
  const [publishDrawId, setPublishDrawId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'draws'],
    queryFn: adminService.getDraws,
    staleTime: 1000 * 30,
    refetchOnMount: true,
  });

  const { mutate: createDraw, isPending: isCreating } = useMutation({
    mutationFn: adminService.createDraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'draws'] });
      toast.success('Draw created.');
      setShowCreateForm(false);
      setDrawMonth('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create draw.');
    },
  });

  const { mutate: simulate, isPending: isSimulating } = useMutation({
    mutationFn: adminService.simulateDraw,
    onSuccess: (response) => {
      setSimulationResult(response.data);
      queryClient.invalidateQueries({ queryKey: ['admin', 'draws'] });
      toast.success('Simulation complete.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Simulation failed.');
    },
  });

  const { mutate: publish, isPending: isPublishing } = useMutation({
    mutationFn: adminService.publishDraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'draws'] });
      toast.success('Draw published. Winner emails sent.');
      setPublishDrawId(null);
      setSimulationResult(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Publish failed.');
    },
  });

  const draws = data?.data || [];

  const handleCreate = () => {
    if (!drawMonth) { toast.error('Select a month'); return; }
    createDraw({
      draw_month: drawMonth,
      draw_type: drawType,
      algorithm_mode: drawType === 'algorithmic' ? algorithmMode : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            Draws
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Create, simulate, and publish monthly draws.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '14px' }}
        >
          {showCreateForm ? 'Cancel' : 'Create New Draw'}
        </button>
      </div>

      {/* Create draw form */}
      {showCreateForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
            New Draw
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="label">Draw Month</label>
              <input
                type="month"
                value={drawMonth}
                onChange={(e) => setDrawMonth(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Draw Type</label>
              <select value={drawType} onChange={(e) => setDrawType(e.target.value)} className="input">
                <option value="random">Random</option>
                <option value="algorithmic">Algorithmic</option>
              </select>
            </div>
            {drawType === 'algorithmic' && (
              <div>
                <label className="label">Algorithm Mode</label>
                <select value={algorithmMode} onChange={(e) => setAlgorithmMode(e.target.value)} className="input">
                  <option value="frequent">Most Frequent Scores</option>
                  <option value="rare">Least Frequent Scores</option>
                </select>
              </div>
            )}
          </div>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            {isCreating ? 'Creating...' : 'Create Draw'}
          </button>
        </div>
      )}

      {/* Simulation result */}
      {simulationResult && (
        <div className="card" style={{ marginBottom: '24px', border: '1px solid rgba(110,231,183,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)' }}>
              Simulation Results — {formatMonth(simulationResult.drawMonth)}
            </h2>
            <button
              onClick={() => setPublishDrawId(simulationResult.drawId)}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              Publish This Draw
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Drawn Numbers
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {simulationResult.drawnNumbers?.map((n) => (
                <span
                  key={n}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(245,158,11,0.1)',
                    color: 'var(--color-accent)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {['jackpot', 'fourMatch', 'threeMatch'].map((tier) => {
              const info = simulationResult.prizeBreakdown?.[tier];
              if (!info) return null;
              const labels = { jackpot: 'Jackpot (5 match)', fourMatch: '4 Match', threeMatch: '3 Match' };
              return (
                <div key={tier} style={{ padding: '16px', backgroundColor: 'var(--color-elevated)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{labels[tier]}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '18px', marginBottom: '4px' }}>
                    {formatCurrency(info.pool)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {info.winners} winner{info.winners !== 1 ? 's' : ''}
                    {info.winners > 0 && ` — ${formatCurrency(info.prizePerWinner)} each`}
                  </div>
                  {info.willRollover && (
                    <div style={{ fontSize: '11px', color: 'var(--color-warning)', marginTop: '4px' }}>
                      Jackpot will roll over
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Draws list */}
      {isLoading ? (
        <div style={{ color: 'var(--color-text-muted)', padding: '40px', textAlign: 'center' }}>Loading draws...</div>
      ) : draws.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No draws yet. Create the first one.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {draws.map((draw) => (
            <div key={draw.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '16px', marginBottom: '4px' }}>
                    {formatMonth(draw.draw_month)}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <StatusBadge status={draw.status} />
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                      {draw.draw_type}
                    </span>
                    {draw.jackpot_rolled_over && (
                      <span style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 600 }}>
                        Jackpot rolled over
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {draw.status === 'draft' && (
                    <button
                      onClick={() => simulate(draw.id)}
                      disabled={isSimulating}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      {isSimulating ? 'Simulating...' : 'Simulate'}
                    </button>
                  )}
                  {draw.status === 'simulated' && (
                    <>
                      <button
                        onClick={() => simulate(draw.id)}
                        disabled={isSimulating}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        Re-simulate
                      </button>
                      <button
                        onClick={() => setPublishDrawId(draw.id)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        Publish
                      </button>
                    </>
                  )}
                  {draw.status === 'published' && draw.drawn_numbers?.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {draw.drawn_numbers.map((n) => (
                        <span
                          key={n}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(245,158,11,0.1)',
                            color: 'var(--color-accent)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!publishDrawId}
        onClose={() => setPublishDrawId(null)}
        onConfirm={() => publish(publishDrawId)}
        title="Publish Draw"
        description="This will finalise the draw, save all entries, and send emails to winners. This cannot be undone."
        confirmLabel="Publish Draw"
        variant="primary"
        isLoading={isPublishing}
      />
    </motion.div>
  );
};

export default AdminDrawsPage;