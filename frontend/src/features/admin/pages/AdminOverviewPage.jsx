import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { adminService } from '../adminService';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const KpiCard = ({ label, value, sub, color }) => (
  <div className="card">
    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
      {label}
    </div>
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '32px',
        fontWeight: 700,
        color: color || 'var(--color-primary)',
        marginBottom: '4px',
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{sub}</div>
    )}
  </div>
);

const AdminOverviewPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: adminService.getOverview,
    staleTime: 1000 * 60,
    refetchOnMount: true,
  });

  const kpi = data?.data?.kpi;
  const recentSignups = data?.data?.recentSignups || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          Admin Overview
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Platform health at a glance.
        </p>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-text-muted)', padding: '40px' }}>Loading...</div>
      ) : (
        <>
          {/* KPI grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            <KpiCard label="Total Users" value={kpi?.totalUsers || 0} />
            <KpiCard label="Active Subscribers" value={kpi?.activeSubscribers || 0} color="var(--color-success)" />
            <KpiCard label="Total Prize Pool" value={formatCurrency(kpi?.totalPrizePool || 0)} color="var(--color-accent)" />
            <KpiCard label="Charity Raised" value={formatCurrency(kpi?.totalCharityRaised || 0)} color="var(--color-primary)" />
          </div>

          {/* Pending claims alert */}
          {kpi?.pendingClaims > 0 && (
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '10px',
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <span style={{ color: 'var(--color-warning)', fontSize: '14px', fontWeight: 600 }}>
                {kpi.pendingClaims} prize claim{kpi.pendingClaims > 1 ? 's' : ''} awaiting review
              </span>
              <Link to="/admin/winners">
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Review Claims
                </button>
              </Link>
            </div>
          )}

          {/* Recent signups */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)' }}>
                Recent Signups
              </h2>
              <Link to="/admin/users" style={{ fontSize: '13px', color: 'var(--color-primary)', textDecoration: 'none' }}>
                View all
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Name', 'Email', 'Plan', 'Status', 'Joined'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          borderBottom: '1px solid var(--color-border)',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSignups.map((user) => (
                    <tr key={user.id}>
                      {[
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '14px' }}>{user.full_name}</span>,
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{user.email}</span>,
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px', textTransform: 'capitalize' }}>{user.subscription_plan || '—'}</span>,
                        <StatusBadge status={user.subscription_status} />,
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{formatDate(user.created_at)}</span>,
                      ].map((cell, i) => (
                        <td
                          key={i}
                          style={{
                            padding: '12px',
                            borderBottom: '1px solid var(--color-border)',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdminOverviewPage;