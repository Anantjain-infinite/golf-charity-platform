import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { adminService } from '../adminService';
import { formatCurrency } from '../../../utils/formatters';

const COLORS = ['#6EE7B7', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];

const AdminAnalyticsPage = () => {
  const [range, setRange] = useState('30d');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics', range],
    queryFn: () => adminService.getAnalytics(range),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    select: (d) => d.data,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            Analytics
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Platform performance overview.</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="input"
          style={{ maxWidth: '160px' }}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="12m">Last 12 months</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-text-muted)', padding: '40px', textAlign: 'center' }}>Loading analytics...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>

          {/* Subscriber growth */}
          <div className="card">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
              Subscriber Growth
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.subscriberGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3D" />
                <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#13131A', border: '1px solid #2A2A3D', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Line type="monotone" dataKey="count" stroke="#6EE7B7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Prize pool by month */}
          <div className="card">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
              Monthly Prize Pool
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.prizePoolByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3D" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={(v) => `£${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#13131A', border: '1px solid #2A2A3D', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9FAFB' }}
                  formatter={(v) => [formatCurrency(v), 'Prize Pool']}
                />
                <Bar dataKey="total" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Charity breakdown */}
          <div className="card">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
              Charity Contributions
            </h2>
            {data?.charityBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.charityBreakdown}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelStyle={{ fontSize: '11px', fill: '#9CA3AF' }}
                  >
                    {data.charityBreakdown.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#13131A', border: '1px solid #2A2A3D', borderRadius: '8px' }}
                    formatter={(v) => [formatCurrency(v), 'Raised']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                No charity data yet.
              </div>
            )}
          </div>

          {/* Match distribution */}
          <div className="card">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
              Draw Match Distribution
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.matchDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3D" />
                <XAxis dataKey="match" tick={{ fill: '#6B7280', fontSize: 11 }} label={{ value: 'Matches', position: 'insideBottom', offset: -2, fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#13131A', border: '1px solid #2A2A3D', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9FAFB' }}
                  formatter={(v) => [v, 'Entries']}
                />
                <Bar dataKey="count" fill="#6EE7B7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </motion.div>
  );
};

export default AdminAnalyticsPage;