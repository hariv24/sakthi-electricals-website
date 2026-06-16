-- Run this once in Supabase → SQL Editor

-- Product tree (families, categories, subcategories, leaf products)
CREATE TABLE IF NOT EXISTS catalog_nodes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id       uuid REFERENCES catalog_nodes(id) ON DELETE CASCADE,
  name            text NOT NULL,
  slug            text NOT NULL,
  order_index     int  NOT NULL DEFAULT 0,
  is_leaf         boolean NOT NULL DEFAULT false,
  cover_image_url text,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     uuid NOT NULL REFERENCES catalog_nodes(id) ON DELETE CASCADE,
  url         text NOT NULL,
  order_index int  NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_videos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     uuid NOT NULL REFERENCES catalog_nodes(id) ON DELETE CASCADE,
  youtube_url text NOT NULL,
  order_index int  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_specs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     uuid NOT NULL REFERENCES catalog_nodes(id) ON DELETE CASCADE,
  label       text NOT NULL,
  value       text NOT NULL,
  order_index int  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_overview (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     uuid NOT NULL REFERENCES catalog_nodes(id) ON DELETE CASCADE UNIQUE,
  heading     text NOT NULL,
  paragraph_1 text NOT NULL,
  paragraph_2 text
);

CREATE TABLE IF NOT EXISTS product_applications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     uuid NOT NULL REFERENCES catalog_nodes(id) ON DELETE CASCADE,
  title       text NOT NULL,
  body        text NOT NULL,
  order_index int  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS news_items (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  published_date date NOT NULL,
  content        text NOT NULL,
  created_at     timestamptz DEFAULT now()
);

-- RLS: public read, authenticated write
ALTER TABLE catalog_nodes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_videos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_overview     ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items           ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON catalog_nodes        FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_images       FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_videos       FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_specs        FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_overview     FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_applications FOR SELECT USING (true);
CREATE POLICY "public_read" ON news_items           FOR SELECT USING (true);

CREATE POLICY "auth_write" ON catalog_nodes        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON product_images       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON product_videos       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON product_specs        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON product_overview     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON product_applications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON news_items           FOR ALL USING (auth.role() = 'authenticated');
