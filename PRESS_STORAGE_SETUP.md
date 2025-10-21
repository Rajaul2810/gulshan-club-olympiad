# Press Feature Storage Setup

## Current Storage Buckets
Your project already has these storage buckets configured:
- `club-logos` - for club logo uploads
- `media-photos` - for event photos
- `fixture-images` - for fixture images

## Option 1: Use Existing Media Bucket (Recommended)

### Advantages:
- ✅ No additional setup required
- ✅ Reuses existing policies
- ✅ Simpler management
- ✅ Already configured for public access

### Implementation:
The Press feature is already configured to use URL inputs for images, so you can:
1. Upload images to the existing `media-photos` bucket
2. Copy the public URL
3. Paste it in the Press admin form

### How to upload images:
1. Go to Supabase Dashboard → Storage → `media-photos` bucket
2. Upload your press images
3. Copy the public URL
4. Use the URL in the Press admin form

## Option 2: Create Dedicated Press Bucket

If you prefer to keep press images separate, create a new bucket:

### Step 1: Create Bucket
1. Go to Supabase Dashboard → Storage
2. Click "Create new bucket"
3. Name: `press-images`
4. Set as **Public**

### Step 2: Set Storage Policies
Go to Storage → Policies and add these policies for `press-images` bucket:

```sql
-- Allow public read access
CREATE POLICY "Allow public read access to press images" ON storage.objects 
FOR SELECT USING (bucket_id = 'press-images');

-- Allow authenticated upload
CREATE POLICY "Allow authenticated upload of press images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'press-images' AND auth.role() = 'authenticated');

-- Allow authenticated update
CREATE POLICY "Allow authenticated update of press images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'press-images' AND auth.role() = 'authenticated');

-- Allow authenticated delete
CREATE POLICY "Allow authenticated delete of press images" ON storage.objects 
FOR DELETE USING (bucket_id = 'press-images' AND auth.role() = 'authenticated');
```

## Recommendation

**Use Option 1** (existing `media-photos` bucket) because:
- No additional setup required
- Press images are media content
- Simpler to manage
- Already has proper policies configured

## Current Press Implementation

The Press feature is designed to work with URL inputs, so you can:
1. Upload images to any of your existing buckets
2. Copy the public URL
3. Paste it in the Press admin form

No code changes are needed - the current implementation works perfectly with your existing storage setup!
