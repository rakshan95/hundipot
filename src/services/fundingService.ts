import { supabase } from '../lib/supabase';
import { Funding, FileAttachment } from '../types/expense';

export const fundingService = {
  // Get all funding
  async getFunding(): Promise<Funding[]> {
    const { data, error } = await supabase
      .from('funding')
      .select(`
        *,
        funding_attachments (
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

    return data.map(fund => ({
      id: fund.id,
      receivedDate: fund.received_date,
      funderName: fund.funder_name,
      amount: fund.amount,
      isRepayable: fund.is_repayable,
      repaymentDate: fund.repayment_date,
      isPaid: fund.is_paid,
      description: fund.description,
      createdAt: fund.created_at,
      attachments: fund.funding_attachments.map((att: any) => ({
        id: att.id,
        name: att.file_name,
        size: att.file_size,
        type: att.file_type,
        url: att.file_url,
        uploadedAt: att.uploaded_at
      }))
    }));
  },

  // Create funding
  async createFunding(fundingData: Omit<Funding, 'id' | 'createdAt'>): Promise<Funding> {
    const { data, error } = await supabase
      .from('funding')
      .insert({
        received_date: fundingData.receivedDate,
        funder_name: fundingData.funderName,
        amount: fundingData.amount,
        is_repayable: fundingData.isRepayable,
        repayment_date: fundingData.repaymentDate,
        is_paid: false,
        description: fundingData.description
      })
      .select()
      .single();

    if (error) throw error;

    // Handle attachments if any
    if (fundingData.attachments && fundingData.attachments.length > 0) {
      const attachmentInserts = fundingData.attachments.map(att => ({
        funding_id: data.id,
        file_name: att.name,
        file_size: att.size,
        file_type: att.type,
        file_url: att.url
      }));

      const { error: attachmentError } = await supabase
        .from('funding_attachments')
        .insert(attachmentInserts);

      if (attachmentError) throw attachmentError;
    }

    return {
      id: data.id,
      receivedDate: data.received_date,
      funderName: data.funder_name,
      amount: data.amount,
      isRepayable: data.is_repayable,
      repaymentDate: data.repayment_date,
      isPaid: data.is_paid,
      description: data.description,
      createdAt: data.created_at,
      attachments: fundingData.attachments || []
    };
  },

  // Update funding
  async updateFunding(id: string, fundingData: Partial<Funding>): Promise<Funding> {
    const { data, error } = await supabase
      .from('funding')
      .update({
        received_date: fundingData.receivedDate,
        funder_name: fundingData.funderName,
        amount: fundingData.amount,
        is_repayable: fundingData.isRepayable,
        repayment_date: fundingData.repaymentDate,
        is_paid: fundingData.isPaid,
        description: fundingData.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      receivedDate: data.received_date,
      funderName: data.funder_name,
      amount: data.amount,
      isRepayable: data.is_repayable,
      repaymentDate: data.repayment_date,
      isPaid: data.is_paid,
      description: data.description,
      createdAt: data.created_at
    };
  },

  // Delete funding
  async deleteFunding(id: string): Promise<void> {
    // First delete attachments
    await supabase
      .from('funding_attachments')
      .delete()
      .eq('funding_id', id);

    // Then delete funding
    const { error } = await supabase
      .from('funding')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Mark funding as repaid
  async markAsRepaid(id: string): Promise<void> {
    const { error } = await supabase
      .from('funding')
      .update({ is_paid: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
};