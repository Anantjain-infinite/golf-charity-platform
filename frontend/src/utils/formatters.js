import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'GBP 0.00';
  return `INR ${parseFloat(amount).toFixed(2)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = dateString.includes('T')
      ? parseISO(dateString)
      : new Date(dateString + 'T00:00:00');
    return format(date, 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
};

export const formatMonth = (monthString) => {
  if (!monthString) return '';
  try {
    const date = new Date(monthString + '-01');
    return format(date, 'MMMM yyyy');
  } catch {
    return monthString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
  } catch {
    return dateString;
  }
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
};