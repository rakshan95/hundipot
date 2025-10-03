import React, { useState } from 'react';
import { Edit3, Trash2, Search, Filter, MoreVertical, FileText, Download } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency, formatDate } from '../utils/dateUtils';

interface ExpenseManagementProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

const ExpenseManagement: React.FC<ExpenseManagementProps> = ({
  expenses,
  onEditExpense,
  onDeleteExpense
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredExpenses = expenses
    .filter(expense => 
      expense.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === '' || expense.type === filterType)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const uniqueTypes = Array.from(new Set(expenses.map(exp => exp.type)));

  const handleDeleteClick = (expense: Expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.name}"? This action cannot be undone.`)) {
      onDeleteExpense(expense.id);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Expense Management</h2>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto -mx-4 lg:mx-0">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 lg:py-4 lg:px-4 font-semibold text-gray-700 text-sm">Date</th>
                <th className="text-left py-3 px-2 lg:py-4 lg:px-4 font-semibold text-gray-700 text-sm">Name</th>
                <th className="text-left py-3 px-2 lg:py-4 lg:px-4 font-semibold text-gray-700 text-sm">Type</th>
                <th className="text-left py-3 px-2 lg:py-4 lg:px-4 font-semibold text-gray-700 text-sm">Amount</th>
                <th className="text-left py-3 px-2 lg:py-4 lg:px-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="text-left py-3 px-2 lg:py-4 lg:px-4 font-semibold text-gray-700 text-sm">Documents</th>
                <th className="text-left py-3 px-2 lg:py-4 lg:px-4 font-semibold text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-pink-25 transition-colors">
                  <td className="py-3 px-2 lg:py-4 lg:px-4 text-gray-900 text-sm">{formatDate(expense.date)}</td>
                  <td className="py-3 px-2 lg:py-4 lg:px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 text-sm">{expense.name}</span>
                      {expense.isRecurring && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          Recurring
                        </span>
                      )}
                      {expense.gstApplicable && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          GST
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:py-4 lg:px-4 text-gray-600 text-sm">{expense.type}</td>
                  <td className="py-3 px-2 lg:py-4 lg:px-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{formatCurrency(expense.amount)}</p>
                      {expense.gstApplicable && (
                        <p className="text-xs text-green-600">GST: {formatCurrency(expense.gstAmount || 0)}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 lg:py-4 lg:px-4">
                    {expense.isRecurring ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        expense.isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {expense.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        One-time
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 lg:py-4 lg:px-4">
                    {expense.attachments && Array.isArray(expense.attachments) && expense.attachments.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{expense.attachments.length} file(s)</span>
                        <div className="flex space-x-1">
                          {expense.attachments.map((attachment) => (
                            <button
                              key={attachment.id}
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = attachment.url;
                                link.download = attachment.name;
                                link.click();
                              }}
                              className="p-1 text-gray-400 hover:text-[#FE4066] transition-colors"
                              title={`Download ${attachment.name}`}
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No documents</span>
                    )}
                  </td>
                  <td className="py-3 px-2 lg:py-4 lg:px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditExpense(expense)}
                        className="p-2 text-gray-400 hover:text-[#FE4066] hover:bg-pink-50 rounded-lg transition-all"
                        title="Edit expense"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MoreVertical className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No expenses found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-pink-50 rounded-lg overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{filteredExpenses.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">
                {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">
                {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / (filteredExpenses.length || 1))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;