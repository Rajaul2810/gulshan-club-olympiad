# Ultra-Simplified Database Schema Guide

## Overview
Your database is now ultra-simplified with just 2 main tables:

### 1. Fixtures Table
- **Purpose**: Upload images for each sport category
- **Fields**:
  - `id` - Unique identifier
  - `sport` - Sport category (e.g., "Football", "Cricket", "Tennis")
  - `fixture_image` - URL to uploaded image
  - `created_at`, `updated_at` - Timestamps

### 2. Results Table
- **Purpose**: Show winner and loser for each sport
- **Fields**:
  - `id` - Unique identifier
  - `sport` - Sport category
  - `winner_id` - Winner club ID
  - `loser_id` - Loser club ID
  - `notes` - Additional notes
  - `created_at`, `updated_at` - Timestamps

## How to Update Your Database

### Step 1: Run Migration Script
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `DATABASE_MIGRATION.sql`
4. Click "Run" to execute

**⚠️ WARNING**: This will delete all existing fixtures and results data!

### Step 2: Create Storage Bucket
1. Go to Storage in Supabase Dashboard
2. Create new bucket named `fixture-images`
3. Set it as public

### Step 3: Set Storage Policies
In Supabase Dashboard → Storage → Policies, add these policies for `fixture-images` bucket:

```sql
-- Allow public read access
CREATE POLICY "Allow public read access to fixture images" ON storage.objects 
FOR SELECT USING (bucket_id = 'fixture-images');

-- Allow authenticated upload
CREATE POLICY "Allow authenticated upload of fixture images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'fixture-images' AND auth.role() = 'authenticated');

-- Allow authenticated update
CREATE POLICY "Allow authenticated update of fixture images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'fixture-images' AND auth.role() = 'authenticated');

-- Allow authenticated delete
CREATE POLICY "Allow authenticated delete of fixture images" ON storage.objects 
FOR DELETE USING (bucket_id = 'fixture-images' AND auth.role() = 'authenticated');
```

## Usage Examples

### Adding a Fixture (Image Upload)
```typescript
const { data, error } = await supabase
  .from('fixtures')
  .insert({
    sport: 'Football',
    fixture_image: 'https://your-supabase-url/storage/v1/object/public/fixture-images/football-fixture.jpg'
  });
```

### Adding a Result
```typescript
const { data, error } = await supabase
  .from('results')
  .insert({
    sport: 'Football',
    winner_id: 'club-uuid-1',
    loser_id: 'club-uuid-2',
    notes: 'Great match!'
  });
```

### Getting Fixtures by Sport
```typescript
const { data, error } = await supabase
  .from('fixtures')
  .select('*')
  .eq('sport', 'Football');
```

### Getting Results by Sport
```typescript
const { data, error } = await supabase
  .from('results')
  .select(`
    *,
    winner:winner_id(name, logo),
    loser:loser_id(name, logo)
  `)
  .eq('sport', 'Football');
```

## What's Different Now

### Before (Complex):
- Fixtures had teams, dates, venues, status
- Results had scores, fixture relationships
- Complex relationships between tables

### After (Simple):
- Fixtures: Just sport + image
- Results: Just sport + winner + loser + notes
- No complex relationships
- Easy to manage and understand

## Next Steps
1. Run the migration script
2. Update your frontend code to use the new simplified structure
3. Test uploading fixture images
4. Test adding results with winner/loser
