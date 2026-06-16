# Sakthi Electricals — Project Specs

## What the app does and who uses it

A marketing website for Sakthi Electricals (instrument transformer manufacturer, Pudukkottai, Tamil Nadu).
Two types of users:
- **Visitors** — browse products, read about the company, submit enquiries
- **Admin (Manikandan)** — logs into a private dashboard to manage all website content

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS + custom CSS variables
- **Database + Auth + Storage:** Supabase (Postgres, Auth, Storage)
- **Deployment:** Vercel
- **Key libraries:** `@supabase/supabase-js`, `@supabase/ssr`

---

## Pages

### Public
| Route | Description |
|-------|-------------|
| `/` | Home — hero video, about, stats, product families grid, news section, capabilities, customers, CTA |
| `/about` | Company history and team |
| `/products` | Full product catalogue (family grid) |
| `/products/[...slug]` | Folder page (subfolders) or Leaf page (product detail) |
| `/facilities` | Factory and test bench photos |
| `/customers` | Customer logos and testimonials |
| `/careers` | Job listings and application form |
| `/contact` | Contact form + address + phone + email |

### Admin (auth-protected, `/admin`)
| Route | Description |
|-------|-------------|
| `/admin` | Login page (email + password via Supabase Auth) |
| `/admin/dashboard` | Overview / home |
| `/admin/news` | List, add, edit, delete news items |
| `/admin/products` | Full product tree — add/remove/reorder families, categories, subcategories, leaf products |
| `/admin/products/[id]` | Edit a single product node (images, specs, overview, applications, video) |

---

## Data Models (Supabase Postgres)

### `catalog_nodes`
Stores the entire product tree. A node is either a folder (family / category / subcategory) or a leaf (actual product page).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| parent_id | uuid FK → catalog_nodes | null for top-level families |
| name | text | Raw name (used for display) |
| slug | text | URL-safe identifier |
| order_index | int | Sort order within parent |
| is_leaf | boolean | true = product detail page, false = folder |
| cover_image_url | text | Used in grid cards |
| created_at | timestamptz | |

### `product_images`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| node_id | uuid FK → catalog_nodes | |
| url | text | Supabase Storage public URL |
| order_index | int | Gallery order |
| created_at | timestamptz | |

### `product_videos`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| node_id | uuid FK → catalog_nodes | |
| youtube_url | text | Unlisted YouTube URL |
| order_index | int | Position in gallery (after images) |

### `product_specs`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| node_id | uuid FK → catalog_nodes | |
| label | text | e.g. "Standard" |
| value | text | e.g. "IS 2705 / IEC 61869" |
| order_index | int | |

### `product_overview`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| node_id | uuid FK → catalog_nodes | one row per product |
| heading | text | Bold intro line |
| paragraph_1 | text | |
| paragraph_2 | text | optional |

### `product_applications`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| node_id | uuid FK → catalog_nodes | |
| title | text | |
| body | text | |
| order_index | int | max 4 per product |

### `news_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| title | text | |
| published_date | date | |
| content | text | Single paragraph |
| created_at | timestamptz | |

---

## Storage

- Supabase Storage bucket: `product-images`
- Access: public read, authenticated write
- Images uploaded by admin via dashboard, URL stored in `product_images.url`

---

## Auth

- Supabase Auth, email + password
- One admin user: Manikandan (created manually in Supabase dashboard)
- All `/admin/*` routes protected via middleware — redirect to `/admin` (login) if not authenticated
- Server-side session check using `@supabase/ssr`

---

## Product page behaviour (public)

The `[...slug]` route currently reads from the filesystem (CAT-2026 folder).
After migration it will read from Supabase:
- Slug path → traverse `catalog_nodes` tree to find the node
- If `is_leaf = false` → render folder page (grid of children with cover images)
- If `is_leaf = true` → render leaf page:
  - Gallery: `product_images` rows + `product_videos` rows (YouTube embed as last item)
  - Specs: `product_specs` rows
  - Overview: `product_overview` row
  - Applications: `product_applications` rows

Existing product content (currently hardcoded in `page.tsx`) migrates to DB rows.

---

## Migration plan (existing → Supabase)

1. Run `scripts/generate-catalog.mjs` to get current folder tree as JSON
2. Write migration script that walks the tree and inserts rows into `catalog_nodes`
3. Existing images (in `public/assets/CAT-2026/`) are uploaded to Supabase Storage and URLs inserted into `product_images`
4. Hardcoded specs/overview/applications (currently in `app/products/[...slug]/page.tsx`) are inserted as DB rows per product node
5. Once migration is verified, remove filesystem dependency

---

## What "done" looks like

- [ ] Supabase project connected (env vars in `.env.local`)
- [ ] Database tables created (SQL migration file)
- [ ] Auth working — Manikandan can log in at `/admin`
- [ ] Admin dashboard — news CRUD (create, read, update, delete)
- [ ] Admin dashboard — product tree viewer and editor (add/remove/reorder nodes)
- [ ] Admin dashboard — product detail editor (images upload, specs, overview, applications, video URL)
- [ ] Public site reads products from Supabase (not filesystem)
- [ ] News section on home page reads from Supabase
- [ ] Existing products migrated to DB
- [ ] All existing public pages still work correctly
