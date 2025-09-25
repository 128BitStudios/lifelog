-- Create the time_blocks table
CREATE TABLE time_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time_block TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure only one time block per user per time slot
  UNIQUE(user_id, time_block)
);

-- Create indexes for performance
CREATE INDEX idx_time_blocks_user_time ON time_blocks(user_id, time_block);
CREATE INDEX idx_time_blocks_time_block ON time_blocks(time_block);

-- Function to ensure time_block is always 15-minute aligned
CREATE OR REPLACE FUNCTION check_15_minute_alignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if minutes are 0, 15, 30, or 45 and seconds are 0
  IF EXTRACT(MINUTE FROM NEW.time_block) NOT IN (0, 15, 30, 45) 
     OR EXTRACT(SECOND FROM NEW.time_block) != 0 THEN
    RAISE EXCEPTION 'Time block must be aligned to 15-minute intervals (00, 15, 30, 45 minutes)';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to enforce 15-minute alignment
CREATE TRIGGER enforce_15_minute_alignment
  BEFORE INSERT OR UPDATE ON time_blocks
  FOR EACH ROW
  EXECUTE FUNCTION check_15_minute_alignment();

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to automatically update updated_at
CREATE TRIGGER update_time_blocks_updated_at
  BEFORE UPDATE ON time_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own time blocks
CREATE POLICY "Users can view their own time blocks" ON time_blocks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own time blocks" ON time_blocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time blocks" ON time_blocks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time blocks" ON time_blocks
  FOR DELETE USING (auth.uid() = user_id);