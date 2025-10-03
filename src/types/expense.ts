export interface Expense {
  id: string;
  date: string;
  type: string;
  name: string;
  amount: number;
  gstApplicable?: boolean;
  gstAmount?: number;
  isRecurring: boolean;
  dueDate?: string;
  isPaid?: boolean;
  createdAt: string;
  attachments?: FileAttachment[];
}

export interface ExpenseType {
  id: string;
  name: string;
  icon: string;
}

export interface MonthlyKPI {
  month: string;
  totalExpenses: number;
  totalCount: number;
  avgExpense: number;
}

export interface ReportFilter {
  type: 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Funding {
  id: string;
  receivedDate: string;
  funderName: string;
  amount: number;
  isRepayable: boolean;
  repaymentDate?: string;
  isPaid?: boolean;
  createdAt: string;
  attachments?: FileAttachment[];
}