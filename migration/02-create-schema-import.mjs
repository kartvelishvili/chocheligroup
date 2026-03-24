/**
 * Step 2: Create schema on iHost.ge PostgreSQL and import all data
 */
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';

const { Client } = pg;
const DATA_DIR = path.join(import.meta.dirname, 'exported-data');

const client = new Client({
  connectionString: 'postgresql://user_chocheligroup_com:ucAkwqqJ23RJmpUV3LCM@194.163.172.62:5432/site_chocheligroup_com',
  ssl: false,
});

const SCHEMA_SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════
-- Companies
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ka TEXT,
  name_en TEXT,
  description_ka TEXT,
  description_en TEXT,
  logo_url TEXT,
  website TEXT,
  founded_year INTEGER,
  status TEXT DEFAULT 'active',
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Sub-brands (linked to companies)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS sub_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name_ka TEXT,
  name_en TEXT,
  description_ka TEXT,
  description_en TEXT,
  logo_url TEXT,
  website TEXT,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Brands (independent)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ka TEXT,
  name_en TEXT,
  description_ka TEXT,
  description_en TEXT,
  logo_url TEXT,
  website TEXT,
  founding_year INTEGER,
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- News Categories
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS news_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ka TEXT,
  name_en TEXT,
  slug TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- News
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ka TEXT,
  title_en TEXT,
  content_ka TEXT,
  content_en TEXT,
  excerpt_ka TEXT,
  excerpt_en TEXT,
  slug TEXT UNIQUE,
  image_url TEXT,
  category_id UUID REFERENCES news_categories(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Menu Items
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label_ka TEXT,
  label_en TEXT,
  path TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  parent_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Site Content (JSONB key-value store)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Site Design (presets per section)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS site_design (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL,
  preset_number INTEGER DEFAULT 1,
  colors JSONB DEFAULT '{}',
  layout TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Site Settings
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Custom Pages
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS custom_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_ka TEXT,
  title_en TEXT,
  content_ka TEXT,
  content_en TEXT,
  meta_description_ka TEXT,
  meta_description_en TEXT,
  page_type TEXT DEFAULT 'blank',
  link_url TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Who We Are Content
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS who_we_are_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sub_brands_company_id ON sub_brands(company_id);
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section_key);
CREATE INDEX IF NOT EXISTS idx_site_design_section_key ON site_design(section_key);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort_order ON menu_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_companies_order ON companies(order_position);
`;

async function createSchema() {
  console.log('📊 Creating schema on iHost.ge PostgreSQL...\n');
  await client.query(SCHEMA_SQL);
  console.log('✅ Schema created successfully!\n');
}

async function importTable(tableName) {
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⏭️  ${tableName}: no export file found, skipping`);
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!data.length) {
    console.log(`  ⏭️  ${tableName}: 0 rows, skipping`);
    return 0;
  }

  // Clear existing data
  await client.query(`DELETE FROM ${tableName}`);

  const columns = Object.keys(data[0]);
  let imported = 0;

  for (const row of data) {
    const values = columns.map((col) => row[col]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const colNames = columns.map((c) => `"${c}"`).join(', ');

    try {
      await client.query(
        `INSERT INTO ${tableName} (${colNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
        values
      );
      imported++;
    } catch (err) {
      console.error(`  ⚠️  Error inserting row in ${tableName}:`, err.message);
    }
  }

  console.log(`  ✅ ${tableName}: ${imported}/${data.length} rows imported`);
  return imported;
}

async function main() {
  console.log('🚀 Starting iHost.ge PostgreSQL migration...\n');

  await client.connect();
  console.log('✅ Connected to iHost.ge PostgreSQL\n');

  // Test connection
  const { rows } = await client.query('SELECT version()');
  console.log(`  PostgreSQL: ${rows[0].version}\n`);

  // Create schema
  await createSchema();

  // Import order matters (foreign keys)
  const importOrder = [
    'companies',
    'sub_brands',
    'news_categories',
    'news',
    'brands',
    'menu_items',
    'site_content',
    'site_design',
    'site_settings',
    'custom_pages',
    'who_we_are_content',
  ];

  console.log('📥 Importing data:');
  const totals = {};
  for (const table of importOrder) {
    totals[table] = await importTable(table);
  }

  console.log('\n═══════════════════════════════════');
  console.log('Import Summary:');
  for (const [table, count] of Object.entries(totals)) {
    console.log(`  ${table}: ${count} rows`);
  }
  console.log('═══════════════════════════════════\n');

  await client.end();
  console.log('✅ Migration complete!');
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  client.end();
  process.exit(1);
});
