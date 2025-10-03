export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const isOverdue = (dueDate: string): boolean => {
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
};

export const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getCurrentMonth = (): string => {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const getDateRange = (type: string, startDate?: string, endDate?: string) => {
  const today = new Date();
  let start: Date;
  let end: Date = today;

  switch (type) {
    case 'weekly':
      start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'yearly':
      start = new Date(today.getFullYear(), 0, 1);
      break;
    case 'custom':
      start = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth(), 1);
      end = endDate ? new Date(endDate) : today;
      break;
    default:
      start = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  return { start, end };
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex] || 'Invalid Month';
};