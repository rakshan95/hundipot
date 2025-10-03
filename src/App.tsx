import React, { useState } from 'react';
import { useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CreateExpense from './components/CreateExpense';
import CreateFunding from './components/CreateFunding';
import ExpenseManagement from './components/ExpenseManagement';
import FundingManagement from './components/FundingManagement';
import Reports from './components/Reports';
import PaymentReminders from './components/PaymentReminders';
import { Expense, Funding } from './types/expense';
import { monthlyKPIs } from './data/mockData';
import { expenseService } from './services/expenseService';
import { fundingService } from './services/fundingService';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [funding, setFunding] = useState<Funding[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingFunding, setEditingFunding] = useState<Funding | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [expensesData, fundingData] = await Promise.all([
          expenseService.getExpenses(),
          fundingService.getFunding()
        ]);
        setExpenses(expensesData);
        setFunding(fundingData);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data from database');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sectionTitles = {
    dashboard: 'Dashboard',
    create: 'Add New Expense',
    'create-funding': 'Add New Funding',
    manage: 'Manage Expense',
    funding: 'Manage Funding',
    reports: 'Reports & Analytics',
    reminders: 'Payment Reminders'
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      if (editingExpense) {
        const updatedExpense = await expenseService.updateExpense(editingExpense.id, expenseData);
        setExpenses(prev => prev.map(exp => 
          exp.id === editingExpense.id ? updatedExpense : exp
        ));
        setEditingExpense(null);
      } else {
        const newExpense = await expenseService.createExpense(expenseData);
        setExpenses(prev => [newExpense, ...prev]);
      }
      setActiveSection('manage');
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense to database');
    }
  };

  const handleAddFunding = async (fundingData: Omit<Funding, 'id' | 'createdAt'>) => {
    try {
      if (editingFunding) {
        const updatedFunding = await fundingService.updateFunding(editingFunding.id, fundingData);
        setFunding(prev => prev.map(fund => 
          fund.id === editingFunding.id ? updatedFunding : fund
        ));
        setEditingFunding(null);
      } else {
        const newFunding = await fundingService.createFunding(fundingData);
        setFunding(prev => [newFunding, ...prev]);
      }
      setActiveSection('funding');
    } catch (error) {
      console.error('Error saving funding:', error);
      alert('Error saving funding to database');
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveSection('create');
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await expenseService.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense from database');
    }
  };

  const handleEditFunding = (funding: Funding) => {
    setEditingFunding(funding);
    setActiveSection('create-funding');
  };

  const handleDeleteFunding = async (fundingId: string) => {
    try {
      await fundingService.deleteFunding(fundingId);
      setFunding(prev => prev.filter(fund => fund.id !== fundingId));
    } catch (error) {
      console.error('Error deleting funding:', error);
      alert('Error deleting funding from database');
    }
  };

  const handleMarkFundingAsPaid = async (fundingId: string) => {
    try {
      await fundingService.markAsRepaid(fundingId);
      setFunding(prev => prev.map(fund => 
        fund.id === fundingId ? { ...fund, isPaid: true } : fund
      ));
    } catch (error) {
      console.error('Error marking funding as repaid:', error);
      alert('Error updating funding status');
    }
  };

  const handleMarkAsPaid = async (expenseId: string) => {
    try {
      await expenseService.markAsPaid(expenseId);
      setExpenses(prev => prev.map(exp => 
        exp.id === expenseId ? { ...exp, isPaid: true } : exp
      ));
    } catch (error) {
      console.error('Error marking expense as paid:', error);
      alert('Error updating expense status');
    }
  };

  const handleDismissReminder = (expenseId: string) => {
    // For this demo, we'll just mark it as paid
    handleMarkAsPaid(expenseId);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditingFunding(null);
    setActiveSection('manage');
  };

  const handleCancelFundingEdit = () => {
    setEditingFunding(null);
    setActiveSection('funding');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            expenses={expenses} 
            funding={funding}
            onNavigate={setActiveSection}
            onMarkAsPaid={handleMarkAsPaid}
            onDismissReminder={handleDismissReminder}
            onMarkFundingAsPaid={handleMarkFundingAsPaid}
          />
        );
      case 'create':
        return (
          <CreateExpense 
            expenses={expenses}
            onAddExpense={handleAddExpense}
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
          />
        );
      case 'create-funding':
        return (
          <CreateFunding 
            onAddFunding={handleAddFunding}
            editingFunding={editingFunding}
            onCancelEdit={handleCancelFundingEdit}
          />
        );
      case 'manage':
        return (
          <ExpenseManagement
            expenses={expenses}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'funding':
        return (
          <FundingManagement
            funding={funding}
            onEditFunding={handleEditFunding}
            onDeleteFunding={handleDeleteFunding}
          />
        );
      case 'reports':
        return <Reports expenses={expenses} funding={funding} />;
      case 'reminders':
        return (
          <PaymentReminders
            expenses={expenses}
            onMarkAsPaid={handleMarkAsPaid}
            onDismissReminder={handleDismissReminder}
          />
        );
      default:
        return (
          <Dashboard 
            expenses={expenses} 
            monthlyKPIs={monthlyKPIs}
            funding={funding}
            onDismissReminder={handleDismissReminder}
            onMarkFundingAsPaid={handleMarkFundingAsPaid}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      <Header 
        currentSection={sectionTitles[activeSection as keyof typeof sectionTitles]} 
        onMenuToggle={toggleMobileMenu}
      />
      
      <div className="flex">
        <Navigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
        
        <main className="flex-1 overflow-hidden lg:ml-0">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default App;