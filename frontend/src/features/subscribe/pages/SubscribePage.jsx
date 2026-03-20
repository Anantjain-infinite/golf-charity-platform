import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCreateCheckout } from '../hooks/useSubscription';
import { charitiesService } from '../../charities/charitiesService';
import { useAuthStore } from '../../../store/authStore';
import { PLANS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';

const SubscribePage = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedCharity, setSelectedCharity] = useState(
    searchParams.get('charity') || ''
  );

  const { mutate: createCheckout, isPending } = useCreateCheckout();

  const { data: charitiesData } = useQuery({
    queryKey: ['charities', ''],
    queryFn: () => charitiesService.getCharities({ pageParam: 1, search: '' }),
    select: (data) => data.data,
  });

  const charities = charitiesData || [];

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      window.location.href = '/signup';
      return;
    }
    if (!selectedCharity) {
      alert('Please select a charity to support');
      return;
    }
    createCheckout({ plan: selectedPlan, charity_id: selectedCharity });
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ maxWidth: '640px', margin: '0 auto' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 className="section-title" style={{ marginBottom: '12px' }}>
              Choose Your Plan
            </h1>
            <p className="section-subtitle">
              Subscribe to enter monthly draws and support charity.
            </p>
          </div>

          {/* Plan selector */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {Object.values(PLANS).map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-card)',
                  border: selectedPlan === plan.id
                    ? '2px solid var(--color-primary)'
                    : '2px solid var(--color-border)',
                  backgroundColor: selectedPlan === plan.id
                    ? 'rgba(110,231,183,0.05)'
                    : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {plan.savings && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-bg)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {plan.savings}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: selectedPlan === plan.id
                      ? 'var(--color-primary)'
                      : 'var(--color-text-primary)',
                    marginBottom: '4px',
                  }}
                >
                  {formatCurrency(plan.price)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {plan.description}
                </div>
              </div>
            ))}
          </div>

          {/* Charity selector */}
          <div style={{ marginBottom: '32px' }}>
            <label className="label">Choose a Charity to Support</label>
            <select
              value={selectedCharity}
              onChange={(e) => setSelectedCharity(e.target.value)}
              className="input"
            >
              <option value="">Select a charity...</option>
              {charities.map((charity) => (
                <option key={charity.id} value={charity.id}>
                  {charity.name}
                </option>
              ))}
            </select>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              10% of your subscription goes directly to your chosen charity.
            </p>
          </div>

          {/* What you get */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              What is included
            </div>
            {[
              'Monthly prize draw entry',
              'Track up to 5 Stableford scores',
              'Support your chosen charity',
              'Win jackpot, 4-match, or 3-match prizes',
              'Full dashboard access',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  +
                </span>
                {item}
              </div>
            ))}
          </div>

          {/* Subscribe button */}
          <button
            onClick={handleSubscribe}
            disabled={isPending}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '16px' }}
          >
            {isPending
              ? 'Redirecting to checkout...'
              : isAuthenticated
              ? `Subscribe — ${formatCurrency(PLANS[selectedPlan].price)}`
              : 'Create Account to Subscribe'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Payments processed securely by Stripe. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscribePage;