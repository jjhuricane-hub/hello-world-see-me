-- Create seat inventory table
CREATE TABLE presale_seat_inventory (
  tier_id text PRIMARY KEY,
  original_seats integer NOT NULL,
  remaining_seats integer NOT NULL,
  is_sold_out boolean GENERATED ALWAYS AS (remaining_seats <= 0) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add trigger to update updated_at
CREATE TRIGGER update_presale_seat_inventory_updated_at
  BEFORE UPDATE ON presale_seat_inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE presale_seat_inventory ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read seat counts (public data)
CREATE POLICY "Anyone can view seat inventory"
  ON presale_seat_inventory
  FOR SELECT
  USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE presale_seat_inventory;

-- Insert initial seat counts for each presale tier
INSERT INTO presale_seat_inventory (tier_id, original_seats, remaining_seats) VALUES
  ('analyzer_lifetime_founder', 500, 500),
  ('analyzer_annual_founder', 1000, 1000),
  ('parent_single_case', 250, 250),
  ('parent_multi_case', 100, 100),
  ('small_firm_monthly', 25, 25),
  ('small_firm_annual', 25, 25);