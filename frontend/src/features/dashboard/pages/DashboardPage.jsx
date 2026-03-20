import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import ScoreList from '../../scores/components/ScoreList';
import DrawHistoryTab from '../components/DrawHistoryTab';
import WinningsTab from '../components/WinningsTab';
import OverviewTab from '../components/OverviewTab';
import CharityTab from '../components/CharityTab';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'scores', label: 'Scores' },
  { id: 'charity', label: 'Charity' },
  { id: 'draws', label: 'Draw History' },
  { id: 'winnings', label: 'Winnings' },
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '28px',
            color: 'var(--color-text-primary)',
            marginBottom: '4px',
          }}
        >
          Welcome back, {user?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Manage your scores, track draws, and support your charity.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '0',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id
                ? '2px solid var(--color-primary)'
                : '2px solid transparent',
              color: activeTab === tab.id
                ? 'var(--color-primary)'
                : 'var(--color-text-muted)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-body)',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'scores' && (
          <div className="card">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--color-text-primary)',
                marginBottom: '24px',
              }}
            >
              Your Golf Scores
            </h2>
            <ScoreList />
          </div>
        )}
        {activeTab === 'charity' && <CharityTab />}
        {activeTab === 'draws' && <DrawHistoryTab />}
        {activeTab === 'winnings' && <WinningsTab />}
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;