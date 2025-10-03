import * as XLSX from 'xlsx';
import { Expense, Funding } from '../types/expense';
import { formatCurrency, formatDate } from './dateUtils';

interface ReportData {
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  expenses: Expense[];
  funding: Funding[];
  summary: {
    totalExpenses: number;
    totalAmount: number;
    totalGST: number;
    totalFunding: number;
    netCashFlow: number;
    averageExpense: number;
    expensesByType: Record<string, number>;
  };
}

export const generateExcelReport = (reportData: ReportData): void => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['GoGo Expense Tracker - Financial Report'],
    [''],
    ['Report Period:', `${reportData.startDate} to ${reportData.endDate}`],
    ['Generated:', new Date().toLocaleDateString()],
    [''],
    ['FINANCIAL SUMMARY'],
    ['Metric', 'Value'],
    ['Total Expenses', reportData.summary.totalExpenses],
    ['Total Amount', reportData.summary.totalAmount],
    ['Total GST', reportData.summary.totalGST],
    ['Total Funding', reportData.summary.totalFunding],
    ['Net Cash Flow', reportData.summary.netCashFlow],
    ['Average Expense', reportData.summary.averageExpense],
    [''],
    ['EXPENSES BY TYPE'],
    ['Type', 'Amount']
  ];

  // Add expense types data
  Object.entries(reportData.summary.expensesByType)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, amount]) => {
      summaryData.push([type, amount]);
    });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Set column widths
  summarySheet['!cols'] = [
    { width: 20 },
    { width: 15 }
  ];

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Expenses Sheet
  if (reportData.expenses.length > 0) {
    const expenseHeaders = [
      'Date',
      'Name',
      'Type',
      'Amount',
      'GST Applicable',
      'GST Amount',
      'Recurring',
      'Due Date',
      'Status'
    ];

    const expenseData = reportData.expenses.map(expense => [
      expense.date,
      expense.name,
      expense.type,
      expense.amount,
      expense.gstApplicable ? 'Yes' : 'No',
      expense.gstAmount || 0,
      expense.isRecurring ? 'Yes' : 'No',
      expense.dueDate || 'N/A',
      expense.isPaid ? 'Paid' : 'Pending'
    ]);

    const expenseSheet = XLSX.utils.aoa_to_sheet([expenseHeaders, ...expenseData]);
    
    // Set column widths
    expenseSheet['!cols'] = [
      { width: 12 }, // Date
      { width: 25 }, // Name
      { width: 20 }, // Type
      { width: 12 }, // Amount
      { width: 12 }, // GST Applicable
      { width: 12 }, // GST Amount
      { width: 10 }, // Recurring
      { width: 12 }, // Due Date
      { width: 10 }  // Status
    ];

    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');
  }

  // Funding Sheet
  if (reportData.funding.length > 0) {
    const fundingHeaders = [
      'Date Received',
      'Funder Name',
      'Amount',
      'Repayable',
      'Repayment Date',
      'Status',
      'Description'
    ];

    const fundingData = reportData.funding.map(fund => [
      fund.receivedDate,
      fund.funderName,
      fund.amount,
      fund.isRepayable ? 'Yes' : 'No',
      fund.repaymentDate || 'N/A',
      fund.isPaid ? 'Repaid' : 'Pending',
      fund.description || ''
    ]);

    const fundingSheet = XLSX.utils.aoa_to_sheet([fundingHeaders, ...fundingData]);
    
    // Set column widths
    fundingSheet['!cols'] = [
      { width: 15 }, // Date Received
      { width: 20 }, // Funder Name
      { width: 15 }, // Amount
      { width: 10 }, // Repayable
      { width: 15 }, // Repayment Date
      { width: 10 }, // Status
      { width: 30 }  // Description
    ];

    XLSX.utils.book_append_sheet(workbook, fundingSheet, 'Funding');
  }

  // Generate filename
  const fileName = `gogo-financial-report-${reportData.period}-${new Date().toISOString().split('T')[0]}.xlsx`;

  // Write and download the file
  XLSX.writeFile(workbook, fileName);
};