const STATUS_CLASSES = {
    active: 'badge-active',
    inactive: 'badge-inactive',
    lapsed: 'badge-lapsed',
    cancelled: 'badge-cancelled',
    pending: 'badge-pending',
    approved: 'badge-approved',
    paid: 'badge-paid',
    rejected: 'badge-rejected',
    published: 'badge-approved',
    draft: 'badge-inactive',
    simulated: 'badge-pending',
    monthly: 'badge-active',
    yearly: 'badge-approved',
  };
  
  const StatusBadge = ({ status }) => {
    if (!status) return null;
  
    const className = STATUS_CLASSES[status] || 'badge badge-inactive';
  
    return (
      <span className={className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  export default StatusBadge;