import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  Download,
  CheckCircle,
  Clock,
  Banknote,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Expense, Funding } from '../types/expense';
import { formatCurrency, isOverdue, getDaysUntilDue, getMonthName, getDateRange } from '../utils/dateUtils';
import { generateExcelReport } from '../utils/excelGenerator';

interface DashboardProps {
  expenses: Expense[];
  funding: Funding[];
  onNavigate?: (section: string) => void;
  onMarkAsPaid?: (expenseId: string) => void;
  onDismissReminder?: (expenseId: string) => void;
  onMarkFundingAsPaid?: (fundingId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  expenses, 
  funding, 
  onNavigate, 
  onMarkAsPaid, 
  onDismissReminder, 
  onMarkFundingAsPaid 
}) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Calculate current month expenses
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalCurrentMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalGSTCurrentMonth = currentMonthExpenses
    .filter(expense => expense.gstApplicable)
    .reduce((sum, expense) => sum + (expense.gstAmount || 0), 0);
  
  // Calculate previous month for comparison
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const prevMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear;
  });
  
  const totalPrevMonth = prevMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyChange = totalPrevMonth > 0 ? ((totalCurrentMonth - totalPrevMonth) / totalPrevMonth) * 100 : 0;

  // Calculate GST change
  const totalGSTPrevMonth = prevMonthExpenses
    .filter(expense => expense.gstApplicable)
    .reduce((sum, expense) => sum + (expense.gstAmount || 0), 0);
  const gstChange = totalGSTPrevMonth > 0 ? ((totalGSTCurrentMonth - totalGSTPrevMonth) / totalGSTPrevMonth) * 100 : 0;

  // Get overdue bills
  const overdueBills = expenses.filter(expense => 
    expense.isRecurring && expense.dueDate && isOverdue(expense.dueDate) && !expense.isPaid
  );

  // Get upcoming repayments (5 days before due)
  const upcomingRepayments = funding.filter(fund => 
    fund.isRepayable && fund.repaymentDate && !fund.isRepaid &&
    getDaysUntilDue(fund.repaymentDate) <= 5 && getDaysUntilDue(fund.repaymentDate) >= 0
  );

  // Calculate funding totals
  const totalFunding = funding.reduce((sum, fund) => sum + fund.amount, 0);
  const totalRepayable = funding.filter(fund => fund.isRepayable && !fund.isRepaid)
    .reduce((sum, fund) => sum + fund.amount, 0);

  // Recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Recent funding (last 3)
  const recentFunding = [...funding]
    .sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())
    .slice(0, 3);

  const handleDownloadReport = (type: string) => {
    const { start, end } = getDateRange(type);
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
    
    const filteredFunding = funding.filter(fund => {
      const fundDate = new Date(fund.receivedDate);
      return fundDate >= start && fundDate <= end;
    });

    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalGST = filteredExpenses
      .filter(exp => exp.gstApplicable)
      .reduce((sum, exp) => sum + (exp.gstAmount || 0), 0);
    const totalFundingAmount = filteredFunding.reduce((sum, fund) => sum + fund.amount, 0);

    // Group expenses by type
    const expensesByType = filteredExpenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const reportData = {
      title: `GoGo Financial Report - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      period: type,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      summary: {
        totalExpenses: filteredExpenses.length,
        totalAmount: totalAmount,
        totalGST: totalGST,
        totalFunding: totalFundingAmount,
        netCashFlow: totalFundingAmount - totalAmount,
        averageExpense: totalAmount / (filteredExpenses.length || 1),
        expensesByType: expensesByType
      },
      expenses: filteredExpenses,
      funding: filteredFunding
    };

    // Generate and download PDF report
    generateExcelReport(reportData);
  };

  const markBillAsPaid = (expenseId: string) => {
    if (onMarkAsPaid) {
      onMarkAsPaid(expenseId);
    }
  };

  const markAsRepaid = (fundingId: string) => {
    if (onMarkFundingAsPaid) {
      onMarkFundingAsPaid(fundingId);
    }
  };

  const dismissReminder = (id: string, type: 'expense' | 'funding') => {
    if (type === 'expense' && onDismissReminder) {
      onDismissReminder(id);
    } else if (type === 'funding' && onMarkFundingAsPaid) {
      onMarkFundingAsPaid(id);
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border-l-4 border-[#FE4066]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentMonth)}</p>
              <div className="flex items-center mt-2">
                {monthlyChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.abs(monthlyChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-[#FE4066] bg-opacity-10 p-2 lg:p-3 rounded-lg">
              <div className="w-5 h-5 lg:w-6 lg:h-6 text-[#FE4066] text-base lg:text-lg font-bold flex items-center justify-center">₹</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">GST This Month</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(totalGSTCurrentMonth)}</p>
              <div className="flex items-center mt-2">
                {gstChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${gstChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.abs(gstChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-green-100 p-2 lg:p-3 rounded-lg">
              <div className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 text-xs lg:text-sm font-bold flex items-center justify-center">GST</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Bills</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{overdueBills.length}</p>
              <p className="text-sm text-orange-600 mt-2">Needs attention</p>
            </div>
            <div className="bg-orange-100 p-2 lg:p-3 rounded-lg">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Funding</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(totalFunding)}</p>
              <p className="text-sm text-blue-600 mt-2">Received</p>
            </div>
            <div className="bg-blue-100 p-2 lg:p-3 rounded-lg">
              <ArrowDownRight className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Repayable</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(totalRepayable)}</p>
              <p className="text-sm text-purple-600 mt-2">Outstanding</p>
            </div>
            <div className="bg-purple-100 p-2 lg:p-3 rounded-lg">
              <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(overdueBills.length > 0 || upcomingRepayments.length > 0) && (
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
            Alerts & Reminders
          </h3>
          
          <div className="space-y-4">
            {overdueBills.map((bill) => (
              <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-red-50 p-4 rounded-lg border border-red-200 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-red-800">{bill.name}</p>
                    <p className="text-xs sm:text-sm text-red-600">
                      Due: {new Date(bill.dueDate!).toLocaleDateString()} • {formatCurrency(bill.amount)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 sm:ml-4">
                  <button
                    onClick={() => markBillAsPaid(bill.id)}
                    className="px-3 py-1 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark Paid
                  </button>
                  <button
                    onClick={() => dismissReminder(bill.id, 'expense')}
                    className="px-3 py-1 bg-gray-600 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}

            {upcomingRepayments.map((repayment) => (
              <div key={repayment.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Banknote className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800">Repayment Due: {repayment.funderName}</p>
                    <p className="text-xs sm:text-sm text-yellow-600">
                      Due: {new Date(repayment.repaymentDate!).toLocaleDateString()} • {formatCurrency(repayment.amount)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 sm:ml-4">
                  <button
                    onClick={() => markAsRepaid(repayment.id)}
                    className="px-3 py-1 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark Repaid
                  </button>
                  <button
                    onClick={() => dismissReminder(repayment.id, 'funding')}
                    className="px-3 py-1 bg-gray-600 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Downloads</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Weekly Report', type: 'weekly' },
            { label: 'Monthly Report', type: 'monthly' },
            { label: 'Yearly Report', type: 'yearly' },
            { label: 'Custom Range', type: 'custom' }
          ].map((report) => (
            <button
              key={report.type}
              onClick={() => handleDownloadReport(report.type)}
              className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 p-3 border border-gray-200 rounded-lg hover:border-[#FE4066] hover:bg-pink-50 transition-all group"
            >
              <Download className="w-4 h-4 text-gray-600 group-hover:text-[#FE4066]" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-[#FE4066] text-center">
                {report.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-[#FE4066] hover:text-[#E11D48] text-xs sm:text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{expense.name}</p>
                  <p className="text-sm text-gray-600">{expense.type}</p>
                  <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                  {expense.isRecurring && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      Recurring
                    </span>
                  )}
                </div>
              </div>
            ))}
            {recentExpenses.length === 0 && (
              <p className="text-gray-500 text-center py-4">No expenses yet</p>
            )}
          </div>
        </div>

        {/* Recent Funding */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Funding</h3>
            <button
              onClick={() => onNavigate('funding')}
              className="text-[#FE4066] hover:text-[#E11D48] text-xs sm:text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentFunding.map((fund) => (
              <div key={fund.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{fund.funderName}</p>
                  <p className="text-sm text-gray-600">{fund.description || 'Funding received'}</p>
                  <p className="text-xs text-gray-500">{new Date(fund.receivedDate).toLocaleDateString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(fund.amount)}</p>
                  {fund.isRepayable && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 mt-1">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      Repayable
                    </span>
                  )}
                </div>
              </div>
            ))}
            {recentFunding.length === 0 && (
              <p className="text-gray-500 text-center py-4">No funding records yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Expense Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Trends</h3>
        <div className="space-y-4">
          {Array.from({ length: 6 }, (_, i) => {
            const monthIndex = (currentMonth - 5 + i + 12) % 12;
            const year = currentMonth - 5 + i < 0 ? currentYear - 1 : currentYear;
            const monthExpenses = expenses.filter(expense => {
              const expenseDate = new Date(expense.date);
              return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === year;
            });
            const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const monthGST = monthExpenses
              .filter(expense => expense.gstApplicable)
              .reduce((sum, expense) => sum + (expense.gstAmount || 0), 0);
            const maxAmount = Math.max(...Array.from({ length: 6 }, (_, j) => {
              const mIndex = (currentMonth - 5 + j + 12) % 12;
              const mYear = currentMonth - 5 + j < 0 ? currentYear - 1 : currentYear;
              const mExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === mIndex && expenseDate.getFullYear() === mYear;
              });
              return mExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            }), 1);
            const maxGST = Math.max(...Array.from({ length: 6 }, (_, j) => {
              const mIndex = (currentMonth - 5 + j + 12) % 12;
              const mYear = currentMonth - 5 + j < 0 ? currentYear - 1 : currentYear;
              const mExpenses = expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === mIndex && expenseDate.getFullYear() === mYear;
              });
              return mExpenses
                .filter(expense => expense.gstApplicable)
                .reduce((sum, expense) => sum + (expense.gstAmount || 0), 0);
            }), 1);
            const percentage = (monthTotal / maxAmount) * 100;
            const gstPercentage = (monthGST / maxGST) * 100;

            return (
              <div key={`${monthIndex}-${year}`} className="space-y-2">
                {/* Expense Trend */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-12 sm:w-16 text-xs sm:text-sm font-medium text-gray-600">
                    {getMonthName(monthIndex).slice(0, 3)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#FE4066] to-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-20 sm:w-24 text-xs sm:text-sm font-semibold text-gray-800 text-right">
                    {formatCurrency(monthTotal)}
                  </div>
                </div>
                
                {/* GST Trend */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-12 sm:w-16 text-xs text-gray-500">
                    GST
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${gstPercentage}%` }}
                    />
                  </div>
                  <div className="w-20 sm:w-24 text-xs text-green-600 text-right">
                    {formatCurrency(monthGST)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GST Summary */}
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">GST Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total GST (Current Month)</p>
            <p className="text-xl lg:text-2xl font-bold text-green-600">{formatCurrency(totalGSTCurrentMonth)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">GST Applicable Expenses</p>
            <p className="text-xl lg:text-2xl font-bold text-blue-600">
              {currentMonthExpenses.filter(exp => exp.gstApplicable).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Average GST per Expense</p>
            <p className="text-xl lg:text-2xl font-bold text-purple-600">
              {formatCurrency(
                totalGSTCurrentMonth / 
                (currentMonthExpenses.filter(exp => exp.gstApplicable).length || 1)
              )}
            </p>
          </div>
        </div>
        
        {/* Monthly GST Breakdown */}
        <div className="mt-6 space-y-3">
          <h4 className="text-md font-semibold text-gray-700">Monthly GST Breakdown</h4>
          {Array.from({ length: 6 }, (_, i) => {
            const monthIndex = (currentMonth - 5 + i + 12) % 12;
            const year = currentMonth - 5 + i < 0 ? currentYear - 1 : currentYear;
            const monthExpenses = expenses.filter(expense => {
              const expenseDate = new Date(expense.date);
              return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === year;
            });
            const monthGST = monthExpenses
              .filter(expense => expense.gstApplicable)
              .reduce((sum, expense) => sum + (expense.gstAmount || 0), 0);
            const gstExpenseCount = monthExpenses.filter(exp => exp.gstApplicable).length;
            
            return (
              <div key={`gst-${monthIndex}-${year}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="w-12 sm:w-16 text-xs sm:text-sm font-medium text-gray-600">
                  {getMonthName(monthIndex).slice(0, 3)}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs sm:text-sm text-gray-600">{gstExpenseCount} expenses</span>
                  <span className="text-xs sm:text-sm font-semibold text-green-700">{formatCurrency(monthGST)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;