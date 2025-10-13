# Supabase Setup Instructions

## 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

## 2. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Wait for the database to be ready

## 3. Setup Database
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the entire content from `src/lib/supabase/schema.sql`
3. Run the SQL script

## 4. Setup Storage Buckets
1. Go to Storage in your Supabase dashboard
2. Create two public buckets:
   - `club-logos` (for club logo uploads)
   - `media-photos` (for event photos)
3. Set both buckets to public

## 5. Storage Policies
For each bucket, add these policies in Storage > Policies:

### For both buckets (club-logos and media-photos):

**Read Policy:**
- Policy name: "Public read access"
- Allowed operation: SELECT
- Policy definition: `true`

**Insert Policy:**
- Policy name: "Authenticated insert access"
- Allowed operation: INSERT
- Policy definition: `true`

**Update Policy:**
- Policy name: "Authenticated update access"
- Allowed operation: UPDATE
- Policy definition: `true`

**Delete Policy:**
- Policy name: "Authenticated delete access"
- Allowed operation: DELETE
- Policy definition: `true`

## 6. Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Get your Supabase URL and anon key from Project Settings > API
3. Update the values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 7. Restart Development Server
```bash
npm run dev
```

## Database Tables Created:
- `clubs` - Store club information
- `fixtures` - Store match schedules
- `media` - Store photos and video links
- `results` - Store match results

## Features Enabled:
- Real-time subscriptions
- File upload to Supabase Storage
- Automatic timestamps
- Row Level Security (RLS)
- Public read access
- Admin write access

