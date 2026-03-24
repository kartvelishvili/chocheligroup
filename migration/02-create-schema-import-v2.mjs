/**
 * Step 2 (fixed): Auto-derive schema from exported data and import to iHost.ge
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

// Exact schema matching Supabase export
const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing (restart clean)
DROP TABLE IF EXISTS sub_brands CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS news_categories CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS site_design CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS custom_pages CASCADE;
DROP TABLE IF EXISTS who_we_are_content CASCADE;

-- Companies (exact Supabase schema)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ka TEXT,
  name_en TEXT,
  logo_url TEXT,
  description_ka TEXT,
  description_en TEXT,
  industry TEXT,
  founded_year INTEGER,
  website TEXT,
  employees_count INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  project_detail_page_url TEXT,
  order_position INTEGER DEFAULT 0
);

-- Sub-brands
CREATE TABLE sub_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID,
  name_ka TEXT,
  name_en TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  description_ka TEXT,
  description_en TEXT,
  website_url TEXT,
  order_position INTEGER DEFAULT 0
);

-- Brands
CREATE TABLE brands (
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

-- News Categories
CREATE TABLE news_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ka TEXT,
  name_en TEXT,
  slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- News
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ka TEXT,
  title_en TEXT,
  content_ka TEXT,
  content_en TEXT,
  excerpt_ka TEXT,
  excerpt_en TEXT,
  image_url TEXT,
  category_id UUID REFERENCES news_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  image_path TEXT
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label_ka TEXT,
  label_en TEXT,
  path TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Content (JSONB key-value store)
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Design
CREATE TABLE site_design (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL,
  preset_number INTEGER DEFAULT 1,
  preset_name_ka TEXT,
  preset_name_en TEXT,
  is_active BOOLEAN DEFAULT false,
  colors JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  layout TEXT DEFAULT 'default'
);

-- Site Settings
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom Pages
CREATE TABLE custom_pages (
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

-- Who We Are Content
CREATE TABLE who_we_are_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT,
  title_ka TEXT,
  description_en TEXT,
  description_ka TEXT,
  content_en TEXT,
  content_ka TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sub_brands_company_id ON sub_brands(company_id);
CREATE INDEX idx_news_category_id ON news(category_id);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published ON news(published);
CREATE INDEX idx_site_content_section_key ON site_content(section_key);
CREATE INDEX idx_site_design_section_key ON site_design(section_key);
CREATE INDEX idx_menu_items_sort_order ON menu_items(sort_order);
CREATE INDEX idx_companies_order ON companies(order_position);
`;

async function importTable(tableName) {
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⏭️  ${tableName}: no export file, skipping`);
    return 0;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!data.length) {
    console.log(`  ⏭️  ${tableName}: 0 rows, skipping`);
    return 0;
  }

  // Get actual columns from the target table
  const { rows: colRows } = await client.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position`,
    [tableName]
  );
  const tableColumns = new Set(colRows.map(r => r.column_name));

  let imported = 0;
  for (const row of data) {
    // Only use columns that exist in the target table
    const validCols = Object.keys(row).filter(c => tableColumns.has(c));
    const values = validCols.map(col => {
      const v = row[col];
      // Serialize objects to JSON string for JSONB columns
      if (v !== null && typeof v === 'object') return JSON.stringify(v);
      return v;
    });
    const placeholders = validCols.map((_, i) => `$${i + 1}`).join(', ');
    const colNames = validCols.map(c => `"${c}"`).join(', ');

    try {
      await client.query(
        `INSERT INTO ${tableName} (${colNames}) VALUES (${placeholders})`,
        values
      );
      imported++;
    } catch (err) {
      console.error(`  ⚠️  ${tableName} row error:`, err.message.substring(0, 100));
    }
  }

  console.log(`  ✅ ${tableName}: ${imported}/${data.length} rows imported`);
  return imported;
}

async function main() {
  console.log('🚀 Starting iHost.ge PostgreSQL migration (v2)...\n');

  await client.connect();
  const { rows } = await client.query('SELECT version()');
  console.log(`✅ Connected: ${rows[0].version.substring(0, 50)}\n`);

  console.log('📊 Creating schema (DROP + CREATE)...');
  await client.query(SCHEMA_SQL);
  console.log('✅ Schema created!\n');

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
  for (const table of importOrder) {
    await importTable(table);
  }

  // Verification
  console.log('\n📊 Verification:');
  for (const table of importOrder) {
    const { rows } = await client.query(`SELECT COUNT(*) as cnt FROM ${table}`);
    console.log(`  ${table}: ${rows[0].cnt} rows`);
  }

  await client.end();
  console.log('\n✅ Database migration complete!');
}

main().catch(err => {
  console.error('❌ Failed:', err.message);
  client.end();
  process.exit(1);
});
