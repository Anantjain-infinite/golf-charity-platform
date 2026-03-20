import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminService } from '../adminService';
import StatusBadge from '../../../components/shared/StatusBadge';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { formatCurrency } from '../../../utils/formatters';

const AdminCharitiesPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editCharity, setEditCharity] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', website_url: '',
    is_featured: false, is_active: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'charities'],
    queryFn: adminService.getAllCharities,
    staleTime: 1000 * 30,
    refetchOnMount: true,
  });

  const { mutate: createCharity, isPending: isCreating } = useMutation({
    mutationFn: adminService.createCharity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'charities'] });
      queryClient.invalidateQueries({ queryKey: ['charities'] });
      toast.success('Charity created.');
      setShowForm(false);
      setForm({ name: '', slug: '', description: '', website_url: '', is_featured: false, is_active: true });
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Failed to create charity.'),
  });

  const { mutate: updateCharity, isPending: isUpdating } = useMutation({
    mutationFn: adminService.updateCharity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'charities'] });
      queryClient.invalidateQueries({ queryKey: ['charities'] });
      toast.success('Charity updated.');
      setEditCharity(null);
    },
    onError: () => toast.error('Failed to update charity.'),
  });

  const { mutate: deleteCharity, isPending: isDeleting } = useMutation({
    mutationFn: adminService.deleteCharity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'charities'] });
      queryClient.invalidateQueries({ queryKey: ['charities'] });
      toast.success('Charity deactivated.');
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to deactivate charity.'),
  });

  const charities = data?.data || [];

  const handleSubmit = () => {
    if (!form.name || !form.slug) { toast.error('Name and slug are required'); return; }
    if (editCharity) {
      updateCharity({ id: editCharity.id, ...form });
    } else {
      createCharity(form);
    }
  };

  const openEdit = (charity) => {
    setEditCharity(charity);
    setForm({
      name: charity.name,
      slug: charity.slug,
      description: charity.description || '',
      website_url: charity.website_url || '',
      is_featured: charity.is_featured,
      is_active: charity.is_active,
    });
    setShowForm(true);
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
            Charities
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Manage charity listings.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditCharity(null); setForm({ name: '', slug: '', description: '', website_url: '', is_featured: false, is_active: true }); }}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '14px' }}
        >
          {showForm && !editCharity ? 'Cancel' : 'Add Charity'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
            {editCharity ? 'Edit Charity' : 'New Charity'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {[
              { key: 'name', label: 'Name', placeholder: 'Charity name' },
              { key: 'slug', label: 'Slug', placeholder: 'charity-slug' },
              { key: 'website_url', label: 'Website URL', placeholder: 'https://...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="Charity description..."
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
            {[
              { key: 'is_featured', label: 'Featured on homepage' },
              { key: 'is_active', label: 'Active (visible to users)' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                {label}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSubmit}
              disabled={isCreating || isUpdating}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              {isCreating || isUpdating ? 'Saving...' : editCharity ? 'Save Changes' : 'Create Charity'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditCharity(null); }}
              className="btn-secondary"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div style={{ color: 'var(--color-text-muted)', padding: '40px', textAlign: 'center' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {charities.map((charity) => (
            <div key={charity.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '16px' }}>
                      {charity.name}
                    </span>
                    {charity.is_featured && <span className="badge-pending">Featured</span>}
                    <StatusBadge status={charity.is_active ? 'active' : 'inactive'} />
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    {charity.description}
                  </p>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {formatCurrency(charity.total_raised)} raised
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEdit(charity)}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '13px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(charity.id)}
                    className="btn-danger"
                    style={{ padding: '6px 14px', fontSize: '13px' }}
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteCharity(deleteId)}
        title="Deactivate Charity"
        description="This charity will be hidden from users. You can reactivate it later."
        confirmLabel="Deactivate"
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default AdminCharitiesPage;