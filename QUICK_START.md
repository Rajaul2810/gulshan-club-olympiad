# Quick Start Guide - Supabase Integration

## 1. Install Supabase Package

```bash
npm install @supabase/supabase-js
```

## 2. Create `.env.local` File

Create a file named `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Setup Supabase (One-Time Setup)

### A. Create Project
1. Go to https://supabase.com
2. Sign up/Login
3. Click "New Project"
4. Choose organization and set project name
5. Choose region (closest to Bangladesh: Singapore)
6. Set database password (save it!)
7. Wait 2-3 minutes for setup

### B. Get API Keys
1. Go to Project Settings (gear icon)
2. Click "API" in sidebar
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### C. Run SQL Schema
1. In Supabase Dashboard, go to "SQL Editor"
2. Click "New Query"
3. Open `src/lib/supabase/schema.sql` from your project
4. Copy ALL the SQL code
5. Paste in SQL Editor
6. Click "Run" or press Ctrl+Enter
7. Wait for "Success" message

### D. Create Storage Buckets
1. Go to "Storage" in Supabase sidebar
2. Click "New bucket"
3. Name: `club-logos`
4. Make it **Public**
5. Click "Create bucket"
6. Repeat for `media-photos` bucket

### E. Set Storage Policies
For EACH bucket (`club-logos` and `media-photos`):

1. Click the bucket name
2. Go to "Policies" tab
3. Click "New Policy"
4. Choose "Get started quickly"
5. Select "Enable read access for all users"
6. Click "Review" → "Save policy"
7. Click "New Policy" again
8. Choose "For full customization"
9. Name: "Enable insert, update, delete"
10. Allowed operations: Check INSERT, UPDATE, DELETE
11. Policy definition: Just type `true`
12. Click "Review" → "Save policy"

## 4. Start Development Server

```bash
npm run dev
```

## 5. Test It!

1. Open http://localhost:3000/admin/clubs
2. Click "Add New Club"
3. Fill the form
4. Upload a logo image
5. Click "Add Club"
6. Watch it appear in real-time! ✨

## 📱 Test Real-Time Feature

1. Open http://localhost:3000/admin/clubs in TWO browser windows/tabs
2. In one window, add a new club
3. Watch it appear INSTANTLY in the other window without refresh!

## ⚡ Quick Command Reference

```bash
# Install package
npm install @supabase/supabase-js

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### "Failed to fetch clubs"
- ✅ Check if SQL schema ran successfully
- ✅ Verify `.env.local` has correct keys
- ✅ Restart dev server after adding .env.local

### "Failed to upload logo"
- ✅ Check if storage buckets exist
- ✅ Verify bucket names are exactly `club-logos` and `media-photos`
- ✅ Make sure buckets are set to Public
- ✅ Check storage policies are added

### "CORS Error"
- ✅ Your Supabase keys are correct
- ✅ Using latest version of @supabase/supabase-js

### Environment Variables Not Working
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm run dev
```

## 🎯 What You Get

✅ **Real-time updates** - No refresh needed
✅ **File uploads** - Direct to Supabase Storage
✅ **Loading states** - On every button and action
✅ **Error handling** - User-friendly messages
✅ **Form validation** - Prevents invalid data
✅ **Mobile responsive** - Works on all devices
✅ **Production ready** - Scalable architecture

## 📚 File Structure

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts          # Supabase client & utilities
│       ├── database.types.ts  # TypeScript types
│       └── schema.sql         # Database schema
├── hooks/
│   ├── useClubs.ts           # Clubs data & real-time
│   ├── useFixtures.ts        # Fixtures data
│   ├── useMedia.ts           # Media data
│   └── useResults.ts         # Results data
├── components/
│   ├── ui/
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   └── admin/
│       └── AdminLayout.tsx
└── app/
    └── admin/
        ├── page.tsx          # Dashboard
        └── clubs/
            └── page.tsx      # ✅ Fully integrated!
```

## 🚀 Next: Complete Other Pages

Follow the same pattern for:
1. Fixtures Management
2. Media Management (Photo Upload + YouTube Link)
3. Results Management

All the hooks and utilities are ready!

---

**Need Help?**
- Check `SUPABASE_INTEGRATION_COMPLETE.md` for detailed guide
- Check `SETUP_INSTRUCTIONS.md` for step-by-step setup
- All TypeScript types are auto-generated
- Real-time works automatically with the hooks

**Start adding clubs at:** http://localhost:3000/admin/clubs 🎉

