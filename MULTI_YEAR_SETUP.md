# Multi-year Olympiad setup

## 1. Run the database migration

In the Supabase SQL Editor, run the full contents of `EVENTS_MIGRATION.sql`.

This will:
- Create the `events` table
- Seed **2025** (archived) and **2026** (current)
- Add `event_id` to `fixtures`, `results`, `media`, and `press`
- Backfill all existing content to **2025**

## 2. How it works

- Public navbar year switcher: visitors can open **2025** or **2026** content
- Admin header year switcher: choose which year you are managing
- New fixtures / results / media / press are saved to the **selected** year
- Clubs stay shared across years

## 3. Each new year (e.g. 2027)

1. Open **Admin → Events**
2. Create **2027** and optionally set it as current
3. Switch the admin year to **2027**
4. Upload fixtures, results, photos, news for that year

No code changes needed for a new year after the migration is in place.
