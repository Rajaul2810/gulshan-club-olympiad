# Complete Supabase Setup - Step by Step

## 📋 Prerequisites
- Node.js installed
- Next.js project created
- GitHub/Google account for Supabase

---

## Step 1: Install Supabase Package

Open your terminal in the project folder:

```bash
npm install @supabase/supabase-js
```

Wait for installation to complete.

---

## Step 2: Create Supabase Project

### 2.1 Sign Up / Login
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub or Google

### 2.2 Create Organization (First Time Only)
1. Click "New organization"
2. Enter organization name (e.g., "My Organization")
3. Choose "Free" plan
4. Click "Create organization"

### 2.3 Create Project
1. Click "New project"
2. Fill in:
   - **Name:** `olympiad-2025` (or your choice)
   - **Database Password:** Choose strong password (SAVE IT!)
   - **Region:** Choose closest to you
     - For Bangladesh: **Singapore (ap-southeast-1)** or **Mumbai (ap-south-1)**
3. Click "Create new project"
4. ⏳ Wait 2-3 minutes for project to initialize
5. You'll see "Project is ready" message

---

## Step 3: Get API Keys

### 3.1 Navigate to API Settings
1. In your project dashboard, click the ⚙️ **Settings** icon (bottom left)
2. Click "API" in the sidebar

### 3.2 Copy Your Keys
You'll see:
- **Project URL:** `https://xxxxx.supabase.co`
- **Project API keys:**
  - `anon` `public` - This is your public key
  - `service_role` `secret` - This is your secret key

### 3.3 Create `.env.local` File
In your project root, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key_here
```

Replace with your actual values (no quotes needed).

**⚠️ Important:**
- Do NOT commit `.env.local` to git
- Add `.env.local` to your `.gitignore`

---

## Step 4: Create Database Tables

### 4.1 Open SQL Editor
1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New query"

### 4.2 Copy and Run This SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fixtures table
CREATE TABLE IF NOT EXISTS fixtures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport TEXT NOT NULL,
  team1_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  team2_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  sport TEXT NOT NULL,
  url TEXT NOT NULL,
  youtube_url TEXT,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fixture_id UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  team1_score INTEGER NOT NULL,
  team2_score INTEGER NOT NULL,
  winner_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(fixture_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clubs_slug ON clubs(slug);
CREATE INDEX IF NOT EXISTS idx_fixtures_date ON fixtures(date);
CREATE INDEX IF NOT EXISTS idx_fixtures_status ON fixtures(status);
CREATE INDEX IF NOT EXISTS idx_media_sport ON media(sport);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_results_fixture ON results(fixture_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fixtures_updated_at BEFORE UPDATE ON fixtures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (for development)
CREATE POLICY "Allow all operations for everyone" ON clubs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for everyone" ON fixtures FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for everyone" ON media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for everyone" ON results FOR ALL USING (true) WITH CHECK (true);
```

### 4.3 Execute
1. Paste the SQL above into the editor
2. Click **"Run"** button (or press `Ctrl+Enter`)
3. You should see: ✅ **"Success. No rows returned"**

### 4.4 Verify Tables Created
1. Click "Table Editor" in left sidebar
2. You should see 4 tables:
   - clubs
   - fixtures
   - media
   - results

---

## Step 5: Create Storage Buckets

### 5.1 Navigate to Storage
1. Click "Storage" in left sidebar
2. You'll see "No buckets yet"

### 5.2 Create First Bucket (club-logos)
1. Click "New bucket"
2. Fill in:
   - **Name:** `club-logos` (exactly this, lowercase)
   - **Public bucket:** Toggle ON ✅
3. Click "Create bucket"

### 5.3 Create Second Bucket (media-photos)
1. Click "New bucket" again
2. Fill in:
   - **Name:** `media-photos` (exactly this, lowercase)
   - **Public bucket:** Toggle ON ✅
3. Click "Create bucket"

You should now see 2 buckets in the list.

---

## Step 6: Configure Storage Policies

### 6.1 For club-logos Bucket
1. Click on `club-logos` bucket
2. Click "Policies" tab
3. Click "New policy"
4. Choose "For full customization"
5. Fill in:
   - **Policy name:** `Allow all operations`
   - **Allowed operations:** Check ALL boxes (SELECT, INSERT, UPDATE, DELETE)
   - **Policy definition:** Type `true` in both fields
6. Click "Review"
7. Click "Save policy"

### 6.2 For media-photos Bucket
Repeat exact same steps as above for `media-photos` bucket.

---

## Step 7: Verify Everything Works

### 7.1 Test Database Connection
1. Go back to "SQL Editor"
2. Run this test query:
```sql
SELECT COUNT(*) FROM clubs;
```
3. Should return `0` (no clubs yet, but query works)

### 7.2 Test Storage
1. Go to "Storage"
2. Click `club-logos`
3. Click "Upload file"
4. Upload any small image
5. You should see it in the bucket

---

## Step 8: Restart Your Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

---

## Step 9: Test Your App

### 9.1 Open Admin Panel
Open: http://localhost:3000/admin/clubs

### 9.2 Add a Test Club
1. Click "Add New Club"
2. Fill in:
   - **Name:** Test Club
   - **Logo:** Upload any image
   - **Contact Person:** John Doe
   - **Email:** test@example.com
   - **Phone:** +880 1234567890
3. Click "Add Club"
4. Should see "Club added successfully!" message
5. Club should appear in the list

### 9.3 Open in Two Browser Tabs
1. Open http://localhost:3000/admin/clubs in Tab 1
2. Open http://localhost:3000/admin/clubs in Tab 2
3. Add a club in Tab 1
4. Watch it appear INSTANTLY in Tab 2 (real-time!)

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] API keys copied to `.env.local`
- [ ] Database tables created (4 tables)
- [ ] Storage buckets created (2 buckets: club-logos, media-photos)
- [ ] Storage policies configured
- [ ] Dev server restarted
- [ ] Test club added successfully
- [ ] Real-time updates working

---

## 🐛 Common Issues

### Issue: "Failed to fetch clubs"
**Solution:** 
- Check `.env.local` keys are correct
- Restart dev server: `npm run dev`
- Check tables exist in "Table Editor"

### Issue: "new row violates row-level security policy"
**Solution:**
- Run the SQL from `SUPABASE_FIX_RLS.md`
- Or go to Database > Policies and delete/recreate policies

### Issue: "Failed to upload logo"
**Solution:**
- Make sure buckets are PUBLIC
- Check bucket names are exactly: `club-logos` and `media-photos`
- Verify storage policies exist

### Issue: Environment variables not working
**Solution:**
```bash
# Stop server (Ctrl+C)
# Delete .next folder
rm -rf .next  # or manually delete .next folder
# Restart
npm run dev
```

---

## 🎉 Success!

If you can add a club and see it in the list, everything is working! 

**Next Steps:**
- Same pattern works for Fixtures, Media, and Results
- All hooks are ready in `src/hooks/`
- All UI components are ready

---

## 📞 Need Help?

Common commands:
```bash
# Check if Supabase package installed
npm list @supabase/supabase-js

# Reinstall if needed
npm install @supabase/supabase-js --force

# Clear and restart
rm -rf .next
npm run dev
```

Your app is now connected to Supabase! 🚀

