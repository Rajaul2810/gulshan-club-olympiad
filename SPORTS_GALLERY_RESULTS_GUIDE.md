# Sports Gallery & Results - Dynamic Page Guide

## 🎯 Overview

Create a dynamic sports page at `/sports/[slug]` that shows:
- 📅 **Fixtures** - Scheduled matches for this sport
- 📸 **Photos** - Gallery of images from matches
- 🎥 **Videos** - YouTube videos of highlights
- 🏆 **Results** - Match outcomes and winners

All with **real-time updates** and **mobile responsive design**.

---

## 📋 Step-by-Step Implementation

### Step 1: Understanding the Structure

Your sports page already exists at:
```
src/app/sports/[slug]/page.tsx
```

Currently it has:
- Static sample data
- Three tabs (Fixtures, Media, Results)
- Beautiful UI

We'll update it to:
- ✅ Fetch real data from Supabase
- ✅ Filter by sport category
- ✅ Real-time updates
- ✅ Handle empty states
- ✅ Show loading states

---

### Step 2: Update the Sports Detail Page

Replace the entire content of `src/app/sports/[slug]/page.tsx` with the updated version that:
1. Uses real Supabase hooks
2. Filters data by sport name
3. Shows real-time updates
4. Handles loading and errors

**Key Changes:**
```typescript
// OLD (Static data)
const fixturesData = { upcoming: [...] };
const mediaData = { photos: [...], videos: [...] };
const resultsData = [...];

// NEW (Real data from Supabase)
const { fixtures, loading: fixturesLoading } = useFixtures();
const { media, loading: mediaLoading } = useMedia();
const { results, loading: resultsLoading } = useResults();

// Filter by sport
const sportFixtures = fixtures.filter(f => f.sport === sport.name);
const sportMedia = media.filter(m => m.sport === sport.name);
const sportResults = results.filter(r => 
  r.fixture?.sport === sport.name
);
```

---

### Step 3: Data Flow

#### **Fixtures for Sport:**
```
Admin adds fixture → Selects sport category → Saves
↓
Sports page filters fixtures → Shows only this sport
↓
Real-time updates when new fixtures added
```

#### **Media for Sport:**
```
Admin uploads photo/video → Selects sport category → Saves
↓
Sports page filters media → Shows only this sport
↓
Separate tabs for photos and videos
```

#### **Results for Sport:**
```
Admin adds result → Linked to fixture → Fixture has sport
↓
Sports page filters results → Shows only this sport
↓
Displays winner and scores
```

---

### Step 4: Sport Category Matching

**Important:** Sport names must match exactly!

In `SportsCategory.tsx`:
```typescript
{
  name: "Football Men (7 a Side)",
  icon: "⚽",
  // ...
}
```

In Admin when adding fixture/media:
```
Sport dropdown shows: "Football Men (7 a Side)"
Must select exact match!
```

**Case-sensitive matching:**
```typescript
// This works ✅
fixture.sport === "Football Men (7 a Side)"

// This doesn't work ❌
fixture.sport === "football men (7 a side)"
fixture.sport === "Football"
```

---

### Step 5: Adding Test Data

To test the dynamic page, add data for a specific sport:

#### **Add Fixtures:**
1. Go to `/admin/fixtures`
2. Click "Add New Fixture"
3. Select sport: "Football Men (7 a Side)"
4. Select Team 1: "Dhaka Club"
5. Select Team 2: "Gulshan Club"
6. Enter date and venue
7. Submit

#### **Add Media (Photos):**
1. Go to `/admin/media`
2. Click "Upload Media"
3. Select "Photo" type
4. Choose sport: "Football Men (7 a Side)"
5. Upload image
6. Submit

#### **Add Media (Videos):**
1. Go to `/admin/media`
2. Click "Upload Media"
3. Select "Video" type
4. Choose sport: "Football Men (7 a Side)"
5. Enter YouTube URL: `https://youtube.com/watch?v=...`
6. Submit

#### **Add Results:**
1. Go to `/admin/results`
2. Click "Add Result"
3. Select fixture (will show the Football fixture)
4. Enter scores
5. Submit

---

### Step 6: Testing Real-Time Updates

**Test Fixtures:**
1. Open: `http://localhost:3000/sports/football-men-7-a-side`
2. Open: `http://localhost:3000/admin/fixtures` in another tab
3. Add a new Football fixture
4. Watch it appear on sports page instantly!

**Test Media:**
1. Keep sports page open
2. Upload a photo in admin
3. Switch to "Media" tab on sports page
4. See new photo appear without refresh!

**Test Results:**
1. Keep sports page open on "Results" tab
2. Add result for Football fixture
3. See result appear instantly!

---

### Step 7: Empty States

The page handles empty states gracefully:

**No Fixtures:**
```
"No upcoming fixtures at the moment"
```

**No Media:**
```
"No photos/videos available yet"
```

**No Results:**
```
"No results available yet"
```

---

### Step 8: URL Structure

Each sport gets its own URL:

```
Football Men (7 a Side) → /sports/football-men-7-a-side
Basketball Men's → /sports/basketball-mens
Cricket (T-10) → /sports/cricket-t-10
Swimming Men (21 –40 yrs.) → /sports/swimming-men-21-40-yrs
```

**Slug Generation:**
```typescript
export const sportNameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')       // Spaces to hyphens
    .replace(/-+/g, '-')        // Remove duplicate hyphens
    .trim();
};
```

---

### Step 9: Image Handling

#### **For Photos (Uploaded):**
```typescript
// In admin, photos uploaded to Supabase Storage
const { url } = await uploadFile('media-photos', filename, file);

// URL format:
// https://your-project.supabase.co/storage/v1/object/public/media-photos/123.jpg

// In sports page, display with Next Image:
<Image
  src={photo.url}
  alt={photo.title}
  fill
  className="object-cover"
/>
```

#### **For Videos (YouTube):**
```typescript
// Admin saves YouTube URL:
youtube_url: "https://youtube.com/watch?v=ABC123"

// Sports page extracts video ID:
const videoId = video.youtube_url.split('v=')[1];

// Embed or show thumbnail:
<iframe src={`https://youtube.com/embed/${videoId}`} />
// OR
<img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} />
```

---

### Step 10: Configuration

Update `next.config.ts` for images:

```typescript
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'your-project.supabase.co',  // Add your Supabase domain
      'img.youtube.com',            // YouTube thumbnails
    ],
  },
};
```

Replace `your-project.supabase.co` with your actual Supabase project URL.

---

## 🎨 Features Breakdown

### Fixtures Tab

**Shows:**
- Upcoming matches
- Match date and time
- Teams playing
- Venue
- Status badge

**Filters:**
- Only this sport
- Only scheduled/ongoing (not completed)
- Sorted by date (earliest first)

**Empty State:**
- Shows message if no fixtures
- Encourages adding fixtures

### Media Tab

**Toggle Between:**
1. **Photos** - Grid of images
2. **Videos** - Grid of video thumbnails

**For Each Photo:**
- Image preview
- Title/caption
- Hover zoom effect
- Click to enlarge (optional)

**For Each Video:**
- YouTube thumbnail
- Play button overlay
- Title
- Duration (optional)
- Click opens YouTube

**Filters:**
- Only this sport
- Separated by type (photo/video)
- Sorted by date (newest first)

### Results Tab

**Shows:**
- Completed matches
- Team scores
- Winner highlighted
- Date played
- Venue

**Filters:**
- Only this sport
- Only completed matches
- Sorted by date (newest first)

**Visual:**
- Large score numbers
- Winner in orange
- Trophy icon for winner
- Draw indicator if tied

---

## 🔄 Real-Time Flow

### When Admin Adds Fixture:

```
1. Admin saves fixture with sport = "Football Men (7 a Side)"
2. Supabase inserts into fixtures table
3. Supabase broadcasts change via Realtime
4. useFixtures hook receives update
5. Sports page re-filters fixtures
6. New fixture appears instantly
7. All users see update without refresh
```

### When Admin Uploads Photo:

```
1. Admin uploads file to Supabase Storage
2. Gets public URL
3. Saves to media table with sport = "Football Men (7 a Side)"
4. Supabase broadcasts change
5. useMedia hook receives update
6. Sports page re-filters media
7. New photo appears in gallery
8. Real-time for all connected users
```

### When Admin Adds Result:

```
1. Admin adds result for Football fixture
2. Result saved with fixture_id
3. Fixture contains sport name
4. Supabase broadcasts change
5. useResults hook receives update with nested fixture data
6. Sports page filters results by fixture.sport
7. New result appears instantly
8. Winner calculation shown
```

---

## 📱 Mobile Responsive

### Mobile View (< 640px):
- Stacked layout
- Full-width tabs
- 1 column for fixtures
- 2 columns for media
- Enlarged tap targets
- Scrollable tabs
- Optimized images

### Tablet View (640px - 1024px):
- 2 columns for fixtures
- 3 columns for media
- Side-by-side layout
- Better spacing

### Desktop View (> 1024px):
- 3 columns for fixtures
- 4 columns for media
- Full-width layout
- Hover effects

---

## 🎯 Testing Checklist

### Before Testing:
- [ ] Supabase configured
- [ ] Tables created (fixtures, media, results)
- [ ] At least 2 clubs added
- [ ] RLS policies configured

### Test Fixtures:
- [ ] Add fixture for "Football Men (7 a Side)"
- [ ] Go to `/sports/football-men-7-a-side`
- [ ] See fixture in "Fixtures" tab
- [ ] Add another football fixture
- [ ] See it appear instantly

### Test Photos:
- [ ] Upload photo for "Football Men (7 a Side)"
- [ ] Go to sports page
- [ ] Click "Media" tab
- [ ] Click "Photos"
- [ ] See photo in grid
- [ ] Upload another photo
- [ ] See it appear without refresh

### Test Videos:
- [ ] Add YouTube video for Football
- [ ] Go to sports page
- [ ] Click "Media" tab
- [ ] Click "Videos"
- [ ] See video thumbnail
- [ ] Play button overlay shows
- [ ] Add another video
- [ ] See real-time update

### Test Results:
- [ ] Add result for Football fixture
- [ ] Go to sports page
- [ ] Click "Results" tab
- [ ] See result with scores
- [ ] Winner highlighted
- [ ] Add another result
- [ ] See instant update

### Test Real-Time:
- [ ] Open sports page in 2 tabs
- [ ] Add fixture in admin
- [ ] See it appear in both tabs
- [ ] No refresh needed
- [ ] Same for media and results

---

## 🐛 Common Issues & Solutions

### Issue: "No fixtures showing"
**Causes:**
- Sport name doesn't match exactly
- Fixtures added for different sport
- Fixture status is "cancelled"

**Solutions:**
- Check sport name in fixtures table
- Ensure exact match (case-sensitive)
- Verify fixture status is "scheduled" or "ongoing"

### Issue: "Photos not displaying"
**Causes:**
- Image URL incorrect
- Supabase domain not in next.config.ts
- Storage bucket not public

**Solutions:**
- Verify image URL in database
- Add Supabase domain to next.config.ts
- Check storage bucket is public
- Verify storage policies

### Issue: "Videos not showing"
**Causes:**
- Invalid YouTube URL
- YouTube domain not in next.config.ts
- URL format wrong

**Solutions:**
- Use full YouTube URL: `https://youtube.com/watch?v=ABC123`
- Add `img.youtube.com` to next.config.ts
- Test URL in browser first

### Issue: "Results not appearing"
**Causes:**
- Result added but fixture has different sport
- Result fixture relationship broken

**Solutions:**
- Check fixture sport matches
- Verify fixture_id in results table
- Check foreign key relationships

### Issue: "Real-time not working"
**Causes:**
- Supabase Realtime not enabled
- Internet connection issue
- Hook not subscribed

**Solutions:**
- Check Supabase project settings
- Verify internet connection
- Check browser console for errors
- Restart dev server

---

## 💡 Best Practices

### Data Entry:
✅ **Always select sport from dropdown** (ensures exact match)
✅ **Use consistent naming** across all admin pages
✅ **Upload high-quality images** (but compress first)
✅ **Use valid YouTube URLs** only
✅ **Add descriptive titles** to media

### Performance:
✅ **Compress images** before upload (< 2MB)
✅ **Use WebP format** for better compression
✅ **Limit media per sport** (pagination coming soon)
✅ **Cache YouTube thumbnails**
✅ **Optimize database queries**

### User Experience:
✅ **Show loading states** while fetching
✅ **Handle empty states** gracefully
✅ **Display error messages** clearly
✅ **Make buttons accessible**
✅ **Test on mobile devices**

---

## 🔮 Future Enhancements

Potential features to add:

### Media:
- [ ] Lightbox for photos (full-screen view)
- [ ] Slideshow mode
- [ ] Download photos
- [ ] Share to social media
- [ ] Image captions/descriptions
- [ ] Video embed player
- [ ] Video playlists
- [ ] Media pagination

### Filters:
- [ ] Filter by date range
- [ ] Filter by team
- [ ] Filter by venue
- [ ] Search functionality
- [ ] Sort options

### Results:
- [ ] Player statistics
- [ ] Match highlights link
- [ ] Detailed scoreboard
- [ ] MVP awards
- [ ] Match reports

### Social:
- [ ] Share results
- [ ] Comments section
- [ ] Reactions (likes)
- [ ] Social media integration

---

## 📊 Data Structure

### Fixtures Table:
```sql
fixtures (
  id UUID,
  sport TEXT,           -- Must match sport category name
  team1_id UUID,
  team2_id UUID,
  date DATE,
  time TEXT,
  venue TEXT,
  status TEXT           -- scheduled, ongoing, completed
)
```

### Media Table:
```sql
media (
  id UUID,
  title TEXT,
  type TEXT,            -- 'photo' or 'video'
  sport TEXT,           -- Must match sport category name
  url TEXT,             -- Supabase URL for photos
  youtube_url TEXT,     -- YouTube URL for videos
  created_at TIMESTAMP
)
```

### Results Table:
```sql
results (
  id UUID,
  fixture_id UUID,      -- Links to fixtures table
  team1_score INT,
  team2_score INT,
  winner_id UUID,
  notes TEXT
)
```

---

## 🚀 Quick Start

### 1. Update next.config.ts:
```typescript
images: {
  domains: [
    'localhost',
    'your-project.supabase.co',
    'img.youtube.com',
  ],
}
```

### 2. Test with Football:
```bash
# Add test data
1. Add 2 clubs
2. Add fixture for "Football Men (7 a Side)"
3. Upload photo for "Football Men (7 a Side)"
4. Add YouTube video for "Football Men (7 a Side)"
5. Add result for the fixture

# View it
http://localhost:3000/sports/football-men-7-a-side
```

### 3. Test Real-Time:
```bash
# Open in 2 browser tabs
Tab 1: Sports page
Tab 2: Admin panel

# Add data in Tab 2
# See updates in Tab 1 instantly!
```

---

## ✅ Success Checklist

You'll know it's working when:
- [x] Fixtures show for specific sport
- [x] Photos display in grid
- [x] Videos show with thumbnails
- [x] Results show with winners
- [x] Real-time updates work
- [x] Empty states display
- [x] Loading states show
- [x] Mobile responsive
- [x] No console errors
- [x] Images load properly

---

## 🎉 Congratulations!

Your dynamic sports pages now have:
✅ Real data from Supabase
✅ Real-time updates
✅ Photo gallery
✅ Video gallery
✅ Match results
✅ Mobile responsive
✅ Beautiful UI
✅ Loading states
✅ Error handling
✅ Empty states

**Test it at:**
```
http://localhost:3000/sports/[any-sport-slug]
```

Enjoy your dynamic, real-time sports gallery and results system! 🎊

