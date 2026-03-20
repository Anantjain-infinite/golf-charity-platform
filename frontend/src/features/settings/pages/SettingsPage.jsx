import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/axios';
import { useAuthStore } from '../../../store/authStore';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const profileSchema = yup.object({
  full_name: yup.string().min(2).required('Full name is required'),
});

const passwordSchema = yup.object({
  current_password: yup.string().required('Current password is required'),
  new_password: yup.string().min(8, 'Minimum 8 characters').required(),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords do not match')
    .required(),
});

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { full_name: user?.full_name || '' },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data) => api.patch('/users/me', data),
    onSuccess: (response) => {
      updateUser(response.data.data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated.');
    },
    onError: () => toast.error('Failed to update profile.'),
  });

  const { mutate: cancelSubscription, isPending: isCancelling } = useMutation({
    mutationFn: () => api.post('/payments/create-portal-session'),
    onSuccess: (response) => {
      const url = response.data?.data?.url;
      if (url) window.location.href = url;
    },
    onError: () => toast.error('Failed to open billing portal.'),
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: () => api.delete('/users/me'),
    onSuccess: () => {
      logout();
      navigate('/');
      toast.success('Account deleted.');
    },
    onError: () => toast.error('Failed to delete account.'),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
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
          Settings
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Manage your account preferences.
        </p>
      </div>

      <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Profile form */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
            Profile
          </h2>
          <form onSubmit={profileForm.handleSubmit((data) => updateProfile(data))} noValidate>
            <div style={{ marginBottom: '20px' }}>
              <label className="label">Full Name</label>
              <input
                {...profileForm.register('full_name')}
                className="input"
                placeholder="Your full name"
              />
              {profileForm.formState.errors.full_name && (
                <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>
                  {profileForm.formState.errors.full_name.message}
                </p>
              )}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="label">Email Address</label>
              <input
                value={user?.email || ''}
                className="input"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Email cannot be changed.
              </p>
            </div>
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Billing */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Billing
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Manage your subscription, update payment method, or cancel through the Stripe billing portal.
          </p>
          <button
            onClick={() => setShowCancelModal(true)}
            className="btn-secondary"
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            Manage Billing
          </button>
        </div>

        {/* Danger zone */}
        <div
          className="card"
          style={{ border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-error)', marginBottom: '8px' }}>
            Danger Zone
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Deleting your account is permanent. All your data, scores, and draw history will be removed.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn-danger"
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Cancel subscription modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          cancelSubscription();
        }}
        title="Manage Billing"
        description="You will be redirected to the Stripe billing portal where you can update payment details or cancel your subscription."
        confirmLabel="Open Billing Portal"
        cancelLabel="Cancel"
        variant="primary"
        isLoading={isCancelling}
      />

      {/* Delete account modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText('');
        }}
        onConfirm={() => {
          if (deleteConfirmText !== 'DELETE') {
            toast.error('Please type DELETE to confirm');
            return;
          }
          deleteAccount();
        }}
        title="Delete Account"
        description='This action cannot be undone. Type "DELETE" below to confirm.'
        confirmLabel="Delete My Account"
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default SettingsPage;