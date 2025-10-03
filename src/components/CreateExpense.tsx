import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Type, RotateCcw, Upload, X, FileText, Download } from 'lucide-react';
import { Expense, ExpenseType, FileAttachment } from '../types/expense';
import { expenseTypes } from '../data/mockData';
import { handleFileUpload, formatFileSize, getFileIcon } from '../utils/fileUtils';

interface CreateExpenseProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  editingExpense?: Expense | null;
  onCancelEdit?: () => void;
}

const CreateExpense: React.FC<CreateExpenseProps> = ({ 
  expenses, 
  onAddExpense, 
  editingExpense, 
  onCancelEdit 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    name: '',
    amount: '',
    gstApplicable: false,
    gstAmount: '',
    isRecurring: false,
    dueDate: '',
    isPaid: false,
    attachments: []
  });
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        date: editingExpense.date,
        type: editingExpense.type,
        name: editingExpense.name,
        amount: editingExpense.amount.toString(),
        gstApplicable: editingExpense.gstApplicable || false,
        gstAmount: editingExpense.gstAmount?.toString() || '',
        isRecurring: editingExpense.isRecurring,
        dueDate: editingExpense.dueDate || '',
        isPaid: editingExpense.isPaid || false,
        attachments: editingExpense.attachments || []
      });
      setAttachments(editingExpense.attachments || []);
    }
  }, [editingExpense]);

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ ...prev, name }));
    
    // Auto-fetch recurring status if expense with same name exists
    const existingExpense = expenses.find(exp => 
      exp.name.toLowerCase() === name.toLowerCase() && exp.isRecurring
    );
    
    if (existingExpense && !editingExpense) {
      setFormData(prev => ({
        ...prev,
        isRecurring: true,
        dueDate: existingExpense.dueDate || '',
        type: existingExpense.type,
        gstApplicable: existingExpense.gstApplicable || false,
        gstAmount: existingExpense.gstAmount?.toString() || ''
      }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      try {
        const attachment = await handleFileUpload(file);
        setAttachments(prev => [...prev, attachment]);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
      }
    }
    
    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.type || !formData.name || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseData = {
      date: formData.date,
      type: formData.type,
      name: formData.name,
      amount: parseFloat(formData.amount),
      gstApplicable: formData.gstApplicable,
      gstAmount: formData.gstApplicable ? parseFloat(formData.gstAmount) || 0 : 0,
      isRecurring: formData.isRecurring,
      dueDate: formData.isRecurring ? formData.dueDate : undefined,
      isPaid: false,
      attachments: attachments
    };

    onAddExpense(expenseData);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: '',
      name: '',
      amount: '',
      gstApplicable: false,
      gstAmount: '',
      isRecurring: false,
      dueDate: '',
      attachments: []
    });
    setAttachments([]);

    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 lg:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FE4066] to-pink-500 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              {editingExpense ? 'Edit Expense' : 'Create New Expense'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date of Expense
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Type of Expense */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Type className="w-4 h-4 inline mr-1" />
                Type of Expense
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select expense type...</option>
                {expenseTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Expense Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter expense name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-block w-4 h-4 mr-1 text-center">₹</span>
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* GST Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.gstApplicable}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      gstApplicable: e.target.checked,
                      gstAmount: e.target.checked ? prev.gstAmount : ''
                    }))}
                    className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-gray-700">GST Applicable</span>
                </label>
              </div>

              {formData.gstApplicable && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-block w-4 h-4 mr-1 text-center">₹</span>
                    GST Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.gstAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, gstAmount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>
            {/* Recurring Toggle */}
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  <RotateCcw className="w-4 h-4 inline mr-1" />
                  Recurring Expense
                </span>
              </label>
            </div>

            {/* Due Date (only if recurring) */}
            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Mark as Paid (only if not recurring) */}

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Upload className="w-4 h-4 inline mr-1" />
                Attachments
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-pink-25 hover:border-[#FE4066] transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-gray-500" />
                      <p className="mb-2 text-xs sm:text-sm text-gray-500 text-center px-2">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">All file formats supported</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept="*/*"
                    />
                  </label>
                </div>

                {/* Attachment List */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getFileIcon(attachment.type)}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = attachment.url;
                              link.download = attachment.name;
                              link.click();
                            }}
                            className="p-1 text-gray-400 hover:text-[#FE4066] transition-colors"
                            title="Download attachment"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove attachment"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                className="w-full sm:flex-1 bg-gradient-to-r from-[#FE4066] to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-[#E5396B] hover:to-pink-600 focus:ring-4 focus:ring-pink-200 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {editingExpense ? 'Update Expense' : 'Create Expense'}
              </button>
              
              {editingExpense && onCancelEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExpense;