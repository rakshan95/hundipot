-- GoGo Expense Tracker Database Schema
-- Run this script in your Supabase SQL Editor

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  due_date DATE,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create funding table
CREATE TABLE IF NOT EXISTS funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  received_date DATE NOT NULL,
  funder_name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  is_repayable BOOLEAN DEFAULT false,
  repayment_date DATE,
  is_paid BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create expense_attachments table
CREATE TABLE IF NOT EXISTS expense_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Create funding_attachments table
CREATE TABLE IF NOT EXISTS funding_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funding_id UUID NOT NULL REFERENCES funding(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on expenses" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow all operations on funding" ON funding FOR ALL USING (true);
CREATE POLICY "Allow all operations on expense_attachments" ON expense_attachments FOR ALL USING (true);
CREATE POLICY "Allow all operations on funding_attachments" ON funding_attachments FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
CREATE INDEX IF NOT EXISTS idx_expenses_is_recurring ON expenses(is_recurring);
CREATE INDEX IF NOT EXISTS idx_expenses_due_date ON expenses(due_date);
CREATE INDEX IF NOT EXISTS idx_funding_received_date ON funding(received_date);
CREATE INDEX IF NOT EXISTS idx_funding_is_repayable ON funding(is_repayable);
CREATE INDEX IF NOT EXISTS idx_funding_repayment_date ON funding(repayment_date);
CREATE INDEX IF NOT EXISTS idx_expense_attachments_expense_id ON expense_attachments(expense_id);
CREATE INDEX IF NOT EXISTS idx_funding_attachments_funding_id ON funding_attachments(funding_id);

-- Insert sample data (optional)
INSERT INTO expenses (date, type, name, amount, is_recurring, due_date, is_paid) VALUES
('2025-01-01', 'Rent', 'Office Rent', 2500.00, true, '2025-02-01', true),
('2025-01-05', 'Utilities', 'Electricity Bill', 450.00, true, '2025-02-05', false),
('2025-01-10', 'Subscriptions & Due', 'Software License', 199.00, true, '2025-02-10', false),
('2025-01-15', 'Food & Dining', 'Team Lunch', 85.00, false, null, true),
('2025-01-20', 'Transportation', 'Fuel', 120.00, false, null, true);

INSERT INTO funding (received_date, funder_name, amount, is_repayable, repayment_date, is_paid, description) VALUES
('2024-12-01', 'Angel Investor Group', 500000.00, true, '2025-02-15', false, 'Series A funding round'),
('2024-10-15', 'Government Grant', 250000.00, false, null, false, 'Innovation development grant'),
('2024-08-20', 'Bank Loan', 1000000.00, true, '2025-08-20', false, 'Business expansion loan');