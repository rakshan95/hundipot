import React from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency, formatDate, isOverdue, getDaysUntilDue } from '../utils/dateUtils';

interface PaymentRemindersProps {
  expenses: Expense[];
  onMarkAsPaid: (expenseId: string) => void;
  onDismissReminder: (expenseId: string) => void;
}

const PaymentReminders: React.FC<PaymentRemindersProps> = ({
  expenses,
  onMarkAsPaid,
  onDismissReminder
}) => {
  const recurringExpenses = expenses.filter(expense => 
    expense.isRecurring && expense.dueDate && !expense.isPaid
  );

  const overdueExpenses = recurringExpenses.filter(expense => 
    isOverdue(expense.dueDate!)
  );

  const upcomingExpenses = recurringExpenses.filter(expense => {
    const daysUntil = getDaysUntilDue(expense.dueDate!);
    return daysUntil >= 0 && daysUntil <= 7;
  });

  const laterExpenses = recurringExpenses.filter(expense => {
    const daysUntil = getDaysUntilDue(expense.dueDate!);
    return daysUntil > 7;
  });

  const ReminderCard: React.FC<{ expense: Expense; type: 'overdue' | 'upcoming' | 'later' }> = ({ expense, type }) => {
    const daysUntil = getDaysUntilDue(expense.dueDate!);
    
    const getCardStyles = () => {
      switch (type) {
        case 'overdue':
          return 'bg-red-50 border-red-200';
        case 'upcoming':
          return 'bg-yellow-50 border-yellow-200';
        default:
          return 'bg-gray-50 border-gray-200';
      }
    };

    const getIconStyles = () => {
      switch (type) {
        case 'overdue':
          return 'text-red-500';
        case 'upcoming':
          return 'text-yellow-500';
        default:
          return 'text-gray-500';
      }
    };

    const getIcon = () => {
      switch (type) {
        case 'overdue':
          return AlertTriangle;
        case 'upcoming':
          return Clock;
        default:
          return Bell;
      }
    };

    const Icon = getIcon();

    return (
      <div className={`p-4 rounded-lg border ${getCardStyles()} hover:shadow-md transition-all`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 ${getIconStyles()}`} />
            <div>
              <p className="font-medium text-gray-900">{expense.name}</p>
              <p className="text-sm text-gray-600">
                {type === 'overdue' 
                  ? `Overdue by ${Math.abs(daysUntil)} days`
                  : type === 'upcoming'
                  ? `Due in ${daysUntil} days`
                  : `Due in ${daysUntil} days`
                } • {formatDate(expense.dueDate!)}
              </p>
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onMarkAsPaid(expense.id)}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Mark Paid</span>
            </button>
            <button
              onClick={() => onDismissReminder(expense.id)}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Reminders</h2>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-red-700">Overdue</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-2">{overdueExpenses.length}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-yellow-700">Due Soon</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-2">{upcomingExpenses.length}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700">Later</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{laterExpenses.length}</p>
          </div>
        </div>

        {/* Overdue Bills */}
        {overdueExpenses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Overdue Bills</span>
            </h3>
            <div className="space-y-3">
              {overdueExpenses.map((expense) => (
                <ReminderCard key={expense.id} expense={expense} type="overdue" />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Bills */}
        {upcomingExpenses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Due Soon (Next 7 Days)</span>
            </h3>
            <div className="space-y-3">
              {upcomingExpenses.map((expense) => (
                <ReminderCard key={expense.id} expense={expense} type="upcoming" />
              ))}
            </div>
          </div>
        )}

        {/* Later Bills */}
        {laterExpenses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Upcoming Bills</span>
            </h3>
            <div className="space-y-3">
              {laterExpenses.map((expense) => (
                <ReminderCard key={expense.id} expense={expense} type="later" />
              ))}
            </div>
          </div>
        )}

        {/* No Reminders */}
        {recurringExpenses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-500">No pending payment reminders at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReminders;