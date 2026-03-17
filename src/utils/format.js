import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency,
    maximumFractionDigits: 0 }).format(amount);

export const formatNumber = (n) =>
  new Intl.NumberFormat('en-IN').format(n);

export const calcProgress = (raised, goal) => {
  if (!goal || goal === 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
};

export const daysRemaining = (deadline) => {
  const diff = dayjs(deadline).diff(dayjs(), 'day');
  return Math.max(diff, 0);
};

export const timeAgo = (date) => dayjs(date).fromNow();

export const formatDate = (date) =>
  dayjs(date).format('DD MMM YYYY');

export const truncate = (str, n = 120) =>
  str?.length > n ? str.slice(0, n) + '…' : str;
