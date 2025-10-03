import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, PieChart, Banknote } from 'lucide-react';
import { Expense, ReportFilter, Funding } from '../types/expense';
import { formatCurrency, formatDate, getDateRange } from '../utils/dateUtils';
import { generateExcelReport } from '../utils/excelGenerator';

interface ReportsProps {
  expenses: Expense[];
  funding: Funding[];
}

const Reports: React.FC<ReportsProps> = ({ expenses, funding }) => {
  const [filter, setFilter] = useState<ReportFilter>({ type: 'monthly' });
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const getFilteredExpenses = () => {
    const { start, end } = getDateRange(filter.type, customStartDate, customEndDate);
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalGST = filteredExpenses
    .filter(exp => exp.gstApplicable)
    .reduce((sum, exp) => sum + (exp.gstAmount || 0), 0);

  const getFilteredFunding = () => {
    const { start, end } = getDateRange(filter.type, customStartDate, customEndDate);
    return funding.filter(fund => {
      const fundDate = new Date(fund.receivedDate);
      return fundDate >= start && fundDate <= end;
    });
  };

  const filteredFunding = getFilteredFunding();
  const totalFunding = filteredFunding.reduce((sum, fund) => sum + fund.amount, 0);

  // Group expenses by type
  const expensesByType = filteredExpenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group expenses by month
  const expensesByMonth = filteredExpenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const downloadReport = () => {
    const { start, end } = getDateRange(filter.type, customStartDate, customEndDate);
    
    // Group expenses by type
    const expensesByType = filteredExpenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const reportData = {
      title: `HundiPot Financial Report - ${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}`,
      period: filter.type,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      summary: {
        totalExpenses: filteredExpenses.length,
        totalAmount: totalAmount,
        totalGST: totalGST,
        totalFunding: totalFunding,
        netCashFlow: totalFunding - totalAmount,
        averageExpense: totalAmount / (filteredExpenses.length || 1),
        expensesByType: expensesByType
      },
      expenses: filteredExpenses,
      funding: filteredFunding
    };

    // Generate and download PDF report
    generateExcelReport(reportData);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Financial Reports</h2>
          </div>

          <button
            onClick={downloadReport}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['weekly', 'monthly', 'yearly', 'custom'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter({ type: type as ReportFilter['type'] })}
              className={`p-3 lg:p-4 rounded-lg border-2 transition-all capitalize ${
                filter.type === type
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
            >
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mx-auto mb-2" />
              <span className="text-sm lg:text-base font-medium">{type}</span>
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        {filter.type === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{filteredExpenses.length}</p>
            </div>
            <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 text-xl lg:text-2xl font-bold flex items-center justify-center">₹</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total GST</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(totalGST)}</p>
            </div>
            <div className="w-6 h-6 lg:w-8 lg:h-8 text-green-500 text-xs lg:text-sm font-bold flex items-center justify-center">GST</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Expense</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                {formatCurrency(totalAmount / (filteredExpenses.length || 1))}
              </p>
            </div>
            <PieChart className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Funding</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(totalFunding)}</p>
            </div>
            <Banknote className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Funding Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Breakdown</h3>
        <div className="space-y-4">
          {filteredFunding.map((fund) => {
            const percentage = totalFunding > 0 ? (fund.amount / totalFunding) * 100 : 0;
            return (
              <div key={fund.id} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-32 text-sm font-medium text-gray-600 truncate">{fund.funderName}</div>
                <div className="flex-1">
                  <div className="bg-green-50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between sm:justify-end sm:space-x-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(fund.amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Breakdown by Type */}
      <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown by Type</h3>
        <div className="space-y-4">
          {Object.entries(expensesByType)
            .sort(([,a], [,b]) => b - a)
            .map(([type, amount]) => {
              const percentage = (amount / totalAmount) * 100;
              return (
                <div key={type} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-24 text-sm font-medium text-gray-600 truncate">{type}</div>
                  <div className="flex-1">
                    <div className="bg-blue-50 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(amount)}
                  </div>
                  <div className="w-16 text-sm text-gray-500 text-right">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Detailed Expense List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detailed Expense List */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Expense List</h3>
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-3 h-3 rounded-full ${expense.isRecurring ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-900">{expense.name}</p>
                    <p className="text-sm text-gray-600">{expense.type} • {formatDate(expense.date)}</p>
                    {expense.gstApplicable && (
                      <p className="text-xs text-green-600">GST: {formatCurrency(expense.gstAmount || 0)}</p>
                    )}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                  {expense.gstApplicable && (
                    <p className="text-xs text-green-600">+GST {formatCurrency(expense.gstAmount || 0)}</p>
                  )}
                  {expense.isRecurring && expense.dueDate && (
                    <p className="text-xs text-gray-500">Due: {formatDate(expense.dueDate)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Funding List */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Funding List</h3>
          <div className="space-y-3">
            {filteredFunding.map((fund) => (
              <div key={fund.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-3 h-3 rounded-full ${fund.isRepayable ? 'bg-orange-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="font-medium text-gray-900">{fund.funderName}</p>
                    <p className="text-sm text-gray-600">
                      {fund.isRepayable ? 'Repayable' : 'Grant'} • {formatDate(fund.receivedDate)}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(fund.amount)}</p>
                  {fund.isRepayable && fund.repaymentDate && (
                    <p className="text-xs text-gray-500">Due: {formatDate(fund.repaymentDate)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;