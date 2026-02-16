-- Migration: 014_create_winner_claims
-- Purpose: Add winner claim tracking and delivery status

-- Create winner_claims table
CREATE TABLE IF NOT EXISTS winner_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_number INTEGER NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  claim_date TIMESTAMP WITH TIME ZONE,
  prize_type VARCHAR(20) CHECK (prize_type IN ('physical', 'cash', 'voucher')),
  delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'processing', 'shipped', 'delivered')),
  tracking_number VARCHAR(100),
  claim_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Ensure one claim per user per competition
  UNIQUE(competition_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_winner_claims_user_id ON winner_claims(user_id);
CREATE INDEX idx_winner_claims_competition_id ON winner_claims(competition_id);
CREATE INDEX idx_winner_claims_claimed ON winner_claims(claimed);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_winner_claims_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER winner_claims_updated_at
  BEFORE UPDATE ON winner_claims
  FOR EACH ROW
  EXECUTE FUNCTION update_winner_claims_updated_at();

-- Add comment
COMMENT ON TABLE winner_claims IS 'Tracks winner prize claims and delivery status';
