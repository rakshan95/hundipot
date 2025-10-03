import { supabase } from '../lib/supabase';
import { Expense, FileAttachment } from '../types/expense';

export const expenseService = {
  // Get all expenses
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_attachments (
          id,
          file_name,
          file_size,
          file_type,
          file_url,
          uploaded_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(expense => ({
      id: expense.id,
      date: expense.date,
      type: expense.type,
      name: expense.name,
      amount: expense.amount,
      gstApplicable: expense.gst_applicable,
      gstAmount: expense.gst_amount,
      isRecurring: expense.is_recurring,
      dueDate: expense.due_date,
      isPaid: expense.is_paid,
      createdAt: expense.created_at,
      attachments: expense.expense_attachments.map((att: any) => ({
        id: att.id,
        name: att.file_name,
        size: att.file_size,
        type: att.file_type,
        url: att.file_url,
        uploadedAt: att.uploaded_at
      }))
    }));
  },

  // Create expense
  async createExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        date: expenseData.date,
        type: expenseData.type,
        name: expenseData.name,
        amount: expenseData.amount,
        gst_applicable: expenseData.gstApplicable || false,
        gst_amount: expenseData.gstAmount || 0,
        is_recurring: expenseData.isRecurring,
        due_date: expenseData.dueDate,
        is_paid: false
      })
      .select()
      .single();

    if (error) throw error;

    // Handle attachments if any
    if (expenseData.attachments && expenseData.attachments.length > 0) {
      const attachmentInserts = expenseData.attachments.map(att => ({
        expense_id: data.id,
        file_name: att.name,
        file_size: att.size,
        file_type: att.type,
        file_url: att.url
      }));

      const { error: attachmentError } = await supabase
        .from('expense_attachments')
        .insert(attachmentInserts);

      if (attachmentError) throw attachmentError;
    }

    return {
      id: data.id,
      date: data.date,
      type: data.type,
      name: data.name,
      amount: data.amount,
      gstApplicable: data.gst_applicable,
      gstAmount: data.gst_amount,
      isRecurring: data.is_recurring,
      dueDate: data.due_date,
      isPaid: data.is_paid,
      createdAt: data.created_at,
      attachments: expenseData.attachments || []
    };
  },

  // Update expense
  async updateExpense(id: string, expenseData: Partial<Expense>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update({
        date: expenseData.date,
        type: expenseData.type,
        name: expenseData.name,
        amount: expenseData.amount,
        gst_applicable: expenseData.gstApplicable,
        gst_amount: expenseData.gstAmount,
        is_recurring: expenseData.isRecurring,
        due_date: expenseData.dueDate,
        is_paid: expenseData.isPaid,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      date: data.date,
      type: data.type,
      name: data.name,
      amount: data.amount,
      gstApplicable: data.gst_applicable,
      gstAmount: data.gst_amount,
      isRecurring: data.is_recurring,
      dueDate: data.due_date,
      isPaid: data.is_paid,
      createdAt: data.created_at
    };
  },

  // Delete expense
  async deleteExpense(id: string): Promise<void> {
    // First delete attachments
    await supabase
      .from('expense_attachments')
      .delete()
      .eq('expense_id', id);

    // Then delete expense
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Mark expense as paid
  async markAsPaid(id: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .update({ is_paid: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
};