/*
  # Add GST Support to Expenses

  1. Schema Changes
    - Add `gst_applicable` boolean column to expenses table
    - Add `gst_amount` decimal column to expenses table
    - Add indexes for GST-related queries

  2. Data Migration
    - Set default values for existing records
    - Update RLS policies if needed
*/

-- Add GST columns to expenses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'gst_applicable'
  ) THEN
    ALTER TABLE expenses ADD COLUMN gst_applicable BOOLEAN DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'gst_amount'
  ) THEN
    ALTER TABLE expenses ADD COLUMN gst_amount DECIMAL(12,2) DEFAULT 0.00;
  END IF;
END $$;

-- Create indexes for GST queries
CREATE INDEX IF NOT EXISTS idx_expenses_gst_applicable ON expenses(gst_applicable);
CREATE INDEX IF NOT EXISTS idx_expenses_gst_amount ON expenses(gst_amount) WHERE gst_applicable = true;

-- Update existing records to have GST defaults
UPDATE expenses 
SET gst_applicable = false, gst_amount = 0.00 
WHERE gst_applicable IS NULL OR gst_amount IS NULL;