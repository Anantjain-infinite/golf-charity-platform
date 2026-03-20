import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { dashboardService } from '../dashboardService';
import { charitiesService } from '../../charities/charitiesService';
import api from '../../../lib/axios';
import { MIN_CHARITY_PERCENT, MAX_CHARITY_PERCENT } from '../../../utils/constants';

const CharityTab = () => {
  const queryClient = useQueryClient();
  const [showChangeCharity, setShowChangeCharity] = useState(false);
  const [selectedCharityId, setSelectedCharityId] = useState('');
  const [contributionPercent, setContributionPercent] = useState(10);

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: dashboardService.getProfile,
    select: (data) => data.data,
    onSuccess: (data) => {
      setContributionPercent(data?.charity_contribution_percent || 10);
    },
  });

  const { data: charitiesData } = useQuery({
    queryKey: ['charities', ''],
    queryFn: () => charitiesService.getCharities({ pageParam: 1, search: '' }),
    select: (data) => data.data,
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (updates) => api.patch('/users/me', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Charity preferences updated.');
      setShowChangeCharity(false);
    },
    onError: () => toast.error('Failed to update charity preferences.'),
  });

  const handleSaveContribution = () => {
    updateProfile({ charity_contribution_percent: contributionPercent });
  };

  const handleChangeCharity = () => {
    if (!selectedCharityId) {
      toast.error('Please select a charity');
      return;
    }
    updateProfile({ charity_id: selectedCharityId });
  };

  const charities = charitiesData || [];
  const profile = profileData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Current charity */}
      <div className="card">
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Currently Supporting
        </div>

        {profile?.charity_id ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '16px' }}>
                {charities.find((c) => c.id === profile.charity_id)?.name || 'Selected Charity'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-primary)', marginTop: '4px' }}>
                {profile.charity_contribution_percent}% of your subscription
              </div>
            </div>
            <button
              onClick={() => setShowChangeCharity(!showChangeCharity)}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              {showChangeCharity ? 'Cancel' : 'Change Charity'}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              You have not selected a charity yet.
            </p>
            <button
              onClick={() => setShowChangeCharity(true)}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              Select a Charity
            </button>
          </div>
        )}

        {/* Change charity dropdown */}
        {showChangeCharity && (
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
            <label className="label">Select Charity</label>
            <select
              value={selectedCharityId}
              onChange={(e) => setSelectedCharityId(e.target.value)}
              className="input"
              style={{ marginBottom: '12px' }}
            >
              <option value="">Choose a charity...</option>
              {charities.map((charity) => (
                <option key={charity.id} value={charity.id}>
                  {charity.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleChangeCharity}
              disabled={isPending}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              {isPending ? 'Saving...' : 'Confirm Change'}
            </button>
          </div>
        )}
      </div>

      {/* Contribution slider */}
      <div className="card">
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          Contribution Percentage
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <input
            type="range"
            min={MIN_CHARITY_PERCENT}
            max={MAX_CHARITY_PERCENT}
            value={contributionPercent}
            onChange={(e) => setContributionPercent(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--color-primary)' }}
          />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--color-primary)',
              minWidth: '60px',
              textAlign: 'right',
            }}
          >
            {contributionPercent}%
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          Minimum 10%. This percentage of your subscription goes directly to your chosen charity.
        </p>
        <button
          onClick={handleSaveContribution}
          disabled={isPending}
          className="btn-primary"
          style={{ padding: '8px 20px', fontSize: '13px' }}
        >
          {isPending ? 'Saving...' : 'Save Contribution'}
        </button>
      </div>
    </div>
  );
};

export default CharityTab;