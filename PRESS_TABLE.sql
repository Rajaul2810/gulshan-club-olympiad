-- Press Table for Press Releases and News
-- This table stores press releases and news articles

CREATE TABLE IF NOT EXISTS press (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('press_release', 'news')),
  title TEXT NOT NULL,
  image TEXT,
  content TEXT, -- For press releases
  author_name TEXT,
  source TEXT,
  news_link TEXT, -- For news articles
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_press_type ON press(type);
CREATE INDEX IF NOT EXISTS idx_press_publish_date ON press(publish_date);
CREATE INDEX IF NOT EXISTS idx_press_created_at ON press(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE press ENABLE ROW LEVEL SECURITY;

-- Create policies for public read and admin access
CREATE POLICY "Enable read for all users" ON press FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON press FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON press FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON press FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_press_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_press_updated_at BEFORE UPDATE ON press
    FOR EACH ROW EXECUTE FUNCTION update_press_updated_at_column();
