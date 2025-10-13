# Fix: Row-Level Security Policy Error

## Problem
Error: `new row violates row-level security policy`

This happens because Supabase RLS is blocking your insert/update/delete operations.

## Solution: Update Your Policies

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com
2. Select your project
3. Click "Database" in the left sidebar
4. Click "Policies" tab

### Step 2: Delete Old Policies
For each table (clubs, fixtures, media, results):
1. Find the table in the list
2. Click on the policies
3. Delete all existing policies by clicking the trash icon

### Step 3: Create New Permissive Policies

#### For `clubs` Table:

1. Click on `clubs` table
2. Click "New Policy"
3. Choose "For full customization"
4. Fill in:
   - **Policy name:** `Allow all operations`
   - **Allowed operations:** Check ALL boxes (SELECT, INSERT, UPDATE, DELETE)
   - **Target roles:** Default (public, authenticated)
   - **USING expression:** Type: `true`
   - **WITH CHECK expression:** Type: `true`
5. Click "Review" → Click "Save policy"

#### Repeat for `fixtures` Table:
Same steps as above but for `fixtures` table.

#### Repeat for `media` Table:
Same steps as above but for `media` table.

#### Repeat for `results` Table:
Same steps as above but for `results` table.

### Step 4: Test It
Go back to your app and try adding a club again. It should work now!

---

## Alternative: Use SQL to Fix Policies Quickly

### Option A: Copy this SQL and run in SQL Editor:

```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON clubs;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON clubs;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON clubs;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON clubs;

DROP POLICY IF EXISTS "Enable read access for all users" ON fixtures;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON fixtures;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON fixtures;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON fixtures;

DROP POLICY IF EXISTS "Enable read access for all users" ON media;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON media;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON media;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON media;

DROP POLICY IF EXISTS "Enable read access for all users" ON results;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON results;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON results;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON results;

-- Create new permissive policies
CREATE POLICY "Allow all operations for everyone" ON clubs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for everyone" ON fixtures FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for everyone" ON media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for everyone" ON results FOR ALL USING (true) WITH CHECK (true);
```

**How to run:**
1. Go to Supabase Dashboard
2. Click "SQL Editor" in sidebar
3. Paste the SQL above
4. Click "Run" or press Ctrl+Enter

---

## Option B: Disable RLS (Only for Development!)

**⚠️ Warning: This is LESS SECURE - only use during development**

```sql
-- Disable RLS on all tables
ALTER TABLE clubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures DISABLE ROW LEVEL SECURITY;
ALTER TABLE media DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
```

**To re-enable later:**
```sql
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
```

---

## Why This Happened

The original schema had policies like:
```sql
CREATE POLICY "Enable insert for authenticated users" ON clubs 
FOR INSERT WITH CHECK (true);
```

This requires **authenticated users**, but you're using the **anon key** which is not authenticated.

The new policies allow operations for both authenticated and anonymous users, which works for:
- Development
- Admin panels without authentication
- Public operations

---

## For Production (Later)

When you add authentication:

1. **Install Supabase Auth:**
```bash
npm install @supabase/auth-helpers-nextjs
```

2. **Create Admin-Only Policies:**
```sql
-- Example: Only allow admins to insert
CREATE POLICY "Admin can insert" ON clubs
FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

But for now, the permissive policies will work fine! ✅

