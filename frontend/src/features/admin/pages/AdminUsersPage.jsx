import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { adminService } from '../adminService';
import StatusBadge from '../../../components/shared/StatusBadge';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useDebounce } from '../../../hooks/useDebounce';

const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, debouncedSearch, statusFilter],
    queryFn: () => adminService.getUsers({ pageParam: page, search: debouncedSearch, status: statusFilter }),
    staleTime: 1000 * 30,
    refetchOnMount: true,
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deleted.');
      setDeleteUserId(null);
    },
    onError: () => toast.error('Failed to delete user.'),
  });

  const users = data?.data || [];
  const meta = data?.meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          Users
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Manage all platform subscribers.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input"
          placeholder="Search by name or email..."
          style={{ maxWidth: '320px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input"
          style={{ maxWidth: '180px' }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="lapsed">Lapsed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-text-muted)', padding: '40px', textAlign: 'center' }}>Loading users...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-elevated)' }}>
                  {['Name', 'Email', 'Plan', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '14px' }}>
                        {user.full_name}
                        {user.role === 'admin' && (
                          <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                            Admin
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)', fontSize: '13px', textTransform: 'capitalize' }}>
                        {user.subscription_plan || '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={user.subscription_status} />
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                        {formatDate(user.created_at)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => setDeleteUserId(user.id)}
                            className="btn-danger"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div
              style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Page {meta.page} of {meta.totalPages} — {meta.total} users
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!meta.hasPrevPage}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!meta.hasNextPage}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User detail modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Delete confirm modal */}
      <ConfirmModal
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={() => deleteUser(deleteUserId)}
        title="Delete User"
        description="This will permanently delete the user and all their data. This cannot be undone."
        confirmLabel="Delete User"
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

const UserDetailModal = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.subscription_status);

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: adminService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User updated.');
      onClose();
    },
    onError: () => toast.error('Failed to update user.'),
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}
      />
      <div
        className="card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          zIndex: 10,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
          {user.full_name}
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <label className="label">Email</label>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{user.email}</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label className="label">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input"
          >
            <option value="subscriber">Subscriber</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label className="label">Subscription Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="lapsed">Lapsed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            Cancel
          </button>
          <button
            onClick={() => updateUser({ id: user.id, role, subscription_status: status })}
            disabled={isPending}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default AdminUsersPage;