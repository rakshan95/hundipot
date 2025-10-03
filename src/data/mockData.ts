import { Expense, ExpenseType, MonthlyKPI, Funding } from '../types/expense';

export const expenseTypes: ExpenseType[] = [
  { id: '1', name: 'Rent', icon: 'Home' },
  { id: '2', name: 'Operation Expense', icon: 'Settings' },
  { id: '3', name: 'Subscriptions & Due', icon: 'CreditCard' },
  { id: '4', name: 'Salary', icon: 'Users' },
  { id: '5', name: 'Utilities', icon: 'Zap' },
  { id: '6', name: 'Transportation', icon: 'Car' },
  { id: '7', name: 'Food & Dining', icon: 'UtensilsCrossed' },
  { id: '8', name: 'Entertainment', icon: 'Film' },
  { id: '9', name: 'Health & Medical', icon: 'Heart' },
  { id: '10', name: 'Shopping', icon: 'ShoppingBag' },
  { id: '11', name: 'Marketing & Advertising', icon: 'Megaphone' },
  { id: '12', name: 'Auditing', icon: 'FileCheck' },
  { id: '13', name: 'Employee Training', icon: 'GraduationCap' },
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2025-01-01',
    type: 'Rent',
    name: 'Office Rent',
    amount: 2500,
    isRecurring: true,
    dueDate: '2025-01-01',
    isPaid: true,
    createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: '2',
    date: '2025-01-05',
    type: 'Utilities',
    name: 'Electricity Bill',
    amount: 450,
    isRecurring: true,
    dueDate: '2025-01-05',
    isPaid: false,
    createdAt: '2025-01-05T14:30:00Z'
  },
  {
    id: '3',
    date: '2025-01-10',
    type: 'Subscriptions & Due',
    name: 'Software License',
    amount: 199,
    isRecurring: true,
    dueDate: '2025-01-10',
    isPaid: false,
    createdAt: '2025-01-10T09:15:00Z'
  },
  {
    id: '4',
    date: '2025-01-15',
    type: 'Food & Dining',
    name: 'Team Lunch',
    amount: 85,
    isRecurring: false,
    isPaid: true,
    createdAt: '2025-01-15T12:45:00Z'
  },
  {
    id: '5',
    date: '2025-01-20',
    type: 'Transportation',
    name: 'Fuel',
    amount: 120,
    isRecurring: false,
    isPaid: true,
    createdAt: '2025-01-20T16:20:00Z'
  },
  {
    id: '6',
    date: '2024-12-25',
    type: 'Salary',
    name: 'Employee Salaries',
    amount: 15000,
    isRecurring: true,
    dueDate: '2024-12-25',
    isPaid: true,
    createdAt: '2024-12-25T10:00:00Z'
  },
  {
    id: '7',
    date: '2024-12-15',
    type: 'Operation Expense',
    name: 'Office Supplies',
    amount: 320,
    isRecurring: false,
    isPaid: true,
    createdAt: '2024-12-15T11:30:00Z'
  },
  {
    id: '8',
    date: '2024-11-28',
    type: 'Rent',
    name: 'Office Rent',
    amount: 2500,
    isRecurring: true,
    dueDate: '2024-11-28',
    isPaid: true,
    createdAt: '2024-11-28T10:00:00Z'
  }
];

export const monthlyKPIs: MonthlyKPI[] = [
  { month: 'Jan 2025', totalExpenses: 3354, totalCount: 5, avgExpense: 670.8 },
  { month: 'Dec 2024', totalExpenses: 17820, totalCount: 3, avgExpense: 5940 },
  { month: 'Nov 2024', totalExpenses: 2500, totalCount: 1, avgExpense: 2500 },
  { month: 'Oct 2024', totalExpenses: 5200, totalCount: 4, avgExpense: 1300 },
  { month: 'Sep 2024', totalExpenses: 3800, totalCount: 3, avgExpense: 1266.7 },
  { month: 'Aug 2024', totalExpenses: 4500, totalCount: 5, avgExpense: 900 },
];

export const mockFunding: Funding[] = [
  {
    id: '1',
    receivedDate: '2024-12-01',
    funderName: 'Angel Investor Group',
    amount: 500000,
    isRepayable: true,
    repaymentDate: '2025-02-15',
    isPaid: false,
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    receivedDate: '2024-10-15',
    funderName: 'Government Grant',
    amount: 250000,
    isRepayable: false,
    createdAt: '2024-10-15T14:30:00Z'
  },
  {
    id: '3',
    receivedDate: '2024-08-20',
    funderName: 'Bank Loan',
    amount: 1000000,
    isRepayable: true,
    repaymentDate: '2025-08-20',
    isPaid: false,
    createdAt: '2024-08-20T09:15:00Z'
  }
];