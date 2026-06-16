-- Run this in Supabase SQL editor (Settings → SQL Editor → New query)
ALTER TABLE product_applications ADD COLUMN IF NOT EXISTS icon_name text DEFAULT 'Zap';
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS image_url text;
