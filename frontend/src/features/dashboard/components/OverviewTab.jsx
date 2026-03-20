import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import { dashboardService } from '../dashboardService';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatDate, formatCurrency } from '../../../utils/formatters';

const StatCard = ({ label, value, sub }) => (
  <div className="card" style={{ textAlign: 'center' }}>
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '28px',
        fontWeight: 700,
        color: 'var(--color-primary)',
        marginBottom: '4px',
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        marginBottom: '2px',
      }}
    >
      {label}
    </div>
    {sub && (
      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
        {sub}
      </div>
    )}
  </div>
);

const DrawCountdown = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diff = nextMonth - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, rgba(110,231,183,0.08), rgba(245,158,11,0.05))',
        border: '1px solid rgba(110,231,183,0.2)',
      }}
    >
      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Next Draw
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}
          >
            {days}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
            days
          </span>
        </div>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--color-accent)',
            }}
          >
            {hours}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
            hours
          </span>
        </div>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
        Draw runs on the 1st of each month
      </div>
    </div>
  );
};

const OverviewTab = () => {
  const { user } = useAuthStore();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: dashboardService.getProfile,
    select: (data) => data.data,
  });

  const profile = profileData || user;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Subscription card */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Subscription
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <StatusBadge status={profile?.subscription_status || 'inactive'} />
              {profile?.subscription_plan && (
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                  {profile.subscription_plan} plan
                </span>
              )}
            </div>
            {profile?.subscription_renewal_date && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Renews {formatDate(profile.subscription_renewal_date)}
              </div>
            )}
          </div>

          {profile?.subscription_status !== 'active' && (
            <a href="/subscribe">
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                Subscribe Now
              </button>
            </a>
          )}
        </div>

        {profile?.subscription_status === 'lapsed' && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--color-error)',
            }}
          >
            Your payment failed. Please update your billing details to continue.
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
        }}
      >
        <StatCard
          label="Charity Contributed"
          value={formatCurrency(0)}
          sub="All time"
        />
        <StatCard
          label="Draws Entered"
          value="0"
          sub="All time"
        />
        <StatCard
          label="Total Won"
          value={formatCurrency(0)}
          sub="All time"
        />
      </div>

      {/* Countdown */}
      <DrawCountdown />
    </div>
  );
};

export default OverviewTab;