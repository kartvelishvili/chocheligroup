/**
 * Express API Server for chocheligroup.com
 * Replaces Supabase REST API with direct PostgreSQL + MinIO S3
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// ══════════════════════════════════════
// Configuration (from .env)
// ══════════════════════════════════════
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user_chocheligroup_com:ucAkwqqJ23RJmpUV3LCM@194.163.172.62:5432/site_chocheligroup_com',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
});

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'https://s3.ihost.ge',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'c5UmA8HhmX3DlnVh',
    secretAccessKey: process.env.S3_SECRET_KEY || 'cYo6elo8QRLG62VsN70CQcl4iAufZDOH',
  },
  forcePathStyle: true,
});

const S3_BUCKET = process.env.S3_BUCKET || 'site-chocheligroup-com';
const S3_PUBLIC_BASE = process.env.S3_PUBLIC_URL || 'https://s3.ihost.ge/site-chocheligroup-com';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static frontend build in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Helper: query wrapper
async function query(sql, params) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

// ══════════════════════════════════════
// COMPANIES
// ══════════════════════════════════════
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await query('SELECT * FROM companies ORDER BY order_position ASC');
    const subBrands = await query('SELECT * FROM sub_brands ORDER BY order_position ASC');
    // Nest sub_brands into companies
    const result = companies.map(c => ({
      ...c,
      sub_brands: subBrands.filter(sb => sb.company_id === c.id),
      brands: subBrands.filter(sb => sb.company_id === c.id), // alias used by some components
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/companies/:id', async (req, res) => {
  try {
    const [company] = await query('SELECT * FROM companies WHERE id = $1', [req.params.id]);
    if (!company) return res.status(404).json({ error: 'Not found' });
    company.sub_brands = await query('SELECT * FROM sub_brands WHERE company_id = $1 ORDER BY order_position', [req.params.id]);
    company.brands = company.sub_brands;
    // Related companies (same industry)
    const related = await query(
      'SELECT * FROM companies WHERE industry = $1 AND id != $2 LIMIT 3',
      [company.industry, company.id]
    );
    res.json({ company, related });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/companies', async (req, res) => {
  try {
    const { name_ka, name_en, logo_url, description_ka, description_en, industry, founded_year, website, employees_count, status } = req.body;
    const [maxPos] = await query('SELECT COALESCE(MAX(order_position), 0) + 1 AS next FROM companies');
    const [row] = await query(
      `INSERT INTO companies (name_ka, name_en, logo_url, description_ka, description_en, industry, founded_year, website, employees_count, status, order_position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name_ka, name_en, logo_url, description_ka, description_en, industry, founded_year, website, employees_count, status || 'active', maxPos.next]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update company order positions (bulk) - must be before :id
app.put('/api/companies/reorder', async (req, res) => {
  try {
    const { updates } = req.body; // [{id, order_position}, ...]
    for (const u of updates) {
      await query('UPDATE companies SET order_position = $1 WHERE id = $2', [u.order_position, u.id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/companies/:id', async (req, res) => {
  try {
    const fields = req.body;
    const SKIP_FIELDS = new Set(['id', 'brands', 'sub_brands', 'created_at', 'updated_at']);
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (SKIP_FIELDS.has(key)) continue;
      setClauses.push(`"${key}" = $${i}`);
      values.push(val);
      i++;
    }
    values.push(req.params.id);
    const [row] = await query(
      `UPDATE companies SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/companies/:id', async (req, res) => {
  try {
    await query('DELETE FROM companies WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// SUB-BRANDS
// ══════════════════════════════════════
app.post('/api/sub-brands/bulk', async (req, res) => {
  try {
    const { company_id, sub_brands } = req.body;
    // Delete existing
    await query('DELETE FROM sub_brands WHERE company_id = $1', [company_id]);
    // Insert new
    for (const sb of sub_brands) {
      await query(
        `INSERT INTO sub_brands (company_id, name_ka, name_en, logo_url, description_ka, description_en, website_url, order_position)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [company_id, sb.name_ka, sb.name_en, sb.logo_url, sb.description_ka, sb.description_en, sb.website_url, sb.order_position || 0]
      );
    }
    const rows = await query('SELECT * FROM sub_brands WHERE company_id = $1 ORDER BY order_position', [company_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// BRANDS
// ══════════════════════════════════════
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await query('SELECT * FROM brands ORDER BY created_at DESC');
    const subBrands = await query('SELECT * FROM sub_brands ORDER BY order_position');
    const result = brands.map(b => ({
      ...b,
      sub_brands: subBrands.filter(sb => sb.brand_id === b.id),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/brands/:id', async (req, res) => {
  try {
    const [brand] = await query('SELECT * FROM brands WHERE id = $1', [req.params.id]);
    if (!brand) return res.status(404).json({ error: 'Not found' });
    brand.sub_brands = await query('SELECT * FROM sub_brands WHERE brand_id = $1 ORDER BY order_position', [req.params.id]);
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/brands', async (req, res) => {
  try {
    const { name_ka, name_en, description_ka, description_en, logo_url, website, founding_year } = req.body;
    const [row] = await query(
      `INSERT INTO brands (name_ka, name_en, description_ka, description_en, logo_url, website, founding_year)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name_ka, name_en, description_ka, description_en, logo_url, website, founding_year]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/brands/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (key === 'id' || key === 'sub_brands') continue;
      setClauses.push(`"${key}" = $${i}`);
      values.push(val);
      i++;
    }
    values.push(req.params.id);
    const [row] = await query(
      `UPDATE brands SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/brands/:id', async (req, res) => {
  try {
    await query('DELETE FROM brands WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// NEWS
// ══════════════════════════════════════
app.get('/api/news', async (req, res) => {
  try {
    const { published, limit: lim, category_id } = req.query;
    let sql = `SELECT n.*, nc.name_ka as category_name_ka, nc.name_en as category_name_en, nc.slug as category_slug
               FROM news n LEFT JOIN news_categories nc ON n.category_id = nc.id`;
    const conditions = [];
    const params = [];
    if (published === 'true') { conditions.push(`n.published = true`); }
    if (category_id) { params.push(category_id); conditions.push(`n.category_id = $${params.length}`); }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY n.created_at DESC';
    if (lim) { params.push(parseInt(lim)); sql += ` LIMIT $${params.length}`; }
    const rows = await query(sql, params);
    // Nest category
    const result = rows.map(r => ({
      ...r,
      news_categories: r.category_name_ka ? { name_ka: r.category_name_ka, name_en: r.category_name_en, slug: r.category_slug } : null,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/news/by-slug/:slug', async (req, res) => {
  try {
    const [row] = await query(
      `SELECT n.*, nc.name_ka as category_name_ka, nc.name_en as category_name_en, nc.slug as category_slug
       FROM news n LEFT JOIN news_categories nc ON n.category_id = nc.id
       WHERE n.slug = $1`, [req.params.slug]
    );
    if (!row) return res.status(404).json({ error: 'Not found' });
    row.news_categories = row.category_name_ka ? { name_ka: row.category_name_ka, name_en: row.category_name_en, slug: row.category_slug } : null;
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/news/:id/related', async (req, res) => {
  try {
    const rows = await query(
      `SELECT * FROM news WHERE published = true AND category_id = $1 AND id != $2 ORDER BY created_at DESC LIMIT 3`,
      [req.query.category_id, req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news', async (req, res) => {
  try {
    const { title_ka, title_en, content_ka, content_en, excerpt_ka, excerpt_en, image_url, category_id, slug, published, image_path } = req.body;
    const [row] = await query(
      `INSERT INTO news (title_ka, title_en, content_ka, content_en, excerpt_ka, excerpt_en, image_url, category_id, slug, published, image_path)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title_ka, title_en, content_ka, content_en, excerpt_ka, excerpt_en, image_url, category_id, slug, published || false, image_path]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (key === 'id' || key === 'news_categories') continue;
      setClauses.push(`"${key}" = $${i}`);
      values.push(val);
      i++;
    }
    values.push(req.params.id);
    const [row] = await query(
      `UPDATE news SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    // Delete associated image from S3 if exists
    const [article] = await query('SELECT image_path FROM news WHERE id = $1', [req.params.id]);
    if (article?.image_path) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: article.image_path }));
      } catch {}
    }
    await query('DELETE FROM news WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// NEWS CATEGORIES
// ══════════════════════════════════════
app.get('/api/news-categories', async (req, res) => {
  try {
    const { active } = req.query;
    let sql = 'SELECT * FROM news_categories';
    if (active === 'true') sql += ' WHERE is_active = true';
    sql += ' ORDER BY sort_order';
    res.json(await query(sql));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news-categories', async (req, res) => {
  try {
    const { name_ka, name_en, slug, sort_order, is_active } = req.body;
    const [row] = await query(
      'INSERT INTO news_categories (name_ka, name_en, slug, sort_order, is_active) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name_ka, name_en, slug, sort_order || 0, is_active !== false]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk update order (must be before :id route)
app.put('/api/news-categories/bulk', async (req, res) => {
  try {
    const { items } = req.body;
    for (const item of items) {
      await query(
        `UPDATE news_categories SET sort_order = $1 WHERE id = $2`,
        [item.sort_order, item.id]
      );
    }
    const rows = await query('SELECT * FROM news_categories ORDER BY sort_order');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/news-categories/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (key === 'id') continue;
      setClauses.push(`"${key}" = $${i}`);
      values.push(val);
      i++;
    }
    values.push(req.params.id);
    const [row] = await query(
      `UPDATE news_categories SET ${setClauses.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news-categories/:id', async (req, res) => {
  try {
    await query('DELETE FROM news_categories WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// MENU ITEMS
// ══════════════════════════════════════
app.get('/api/menu-items', async (req, res) => {
  try {
    const { active } = req.query;
    let sql = 'SELECT * FROM menu_items';
    if (active === 'true') sql += ' WHERE is_active = true';
    sql += ' ORDER BY sort_order';
    res.json(await query(sql));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/menu-items', async (req, res) => {
  try {
    const { label_ka, label_en, path: menuPath, is_active, sort_order } = req.body;
    const [row] = await query(
      'INSERT INTO menu_items (label_ka, label_en, path, is_active, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [label_ka, label_en, menuPath, is_active !== false, sort_order || 0]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/menu-items/bulk', async (req, res) => {
  try {
    const { items } = req.body; // Full array of menu items
    for (const item of items) {
      await query(
        `INSERT INTO menu_items (id, label_ka, label_en, path, is_active, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO UPDATE SET label_ka=$2, label_en=$3, path=$4, is_active=$5, sort_order=$6, updated_at=NOW()`,
        [item.id, item.label_ka, item.label_en, item.path, item.is_active, item.sort_order]
      );
    }
    res.json(await query('SELECT * FROM menu_items ORDER BY sort_order'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/menu-items/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (key === 'id') continue;
      setClauses.push(`"${key}" = $${i}`);
      values.push(val);
      i++;
    }
    values.push(req.params.id);
    const [row] = await query(
      `UPDATE menu_items SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/menu-items/:id', async (req, res) => {
  try {
    await query('DELETE FROM menu_items WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// SITE CONTENT
// ══════════════════════════════════════
app.get('/api/site-content', async (req, res) => {
  try {
    res.json(await query('SELECT * FROM site_content ORDER BY section_key'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/site-content/:sectionKey', async (req, res) => {
  try {
    const [row] = await query('SELECT content FROM site_content WHERE section_key = $1', [req.params.sectionKey]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/site-content/:sectionKey', async (req, res) => {
  try {
    const { content } = req.body;
    const [row] = await query(
      'UPDATE site_content SET content = $1::jsonb, updated_at = NOW() WHERE section_key = $2 RETURNING *',
      [JSON.stringify(content), req.params.sectionKey]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// SITE DESIGN
// ══════════════════════════════════════
app.get('/api/site-design', async (req, res) => {
  try {
    res.json(await query('SELECT * FROM site_design ORDER BY preset_number'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk activate/deactivate presets (must be before :id route)
app.put('/api/site-design/activate', async (req, res) => {
  try {
    const { section_key, preset_number } = req.body;
    await query('UPDATE site_design SET is_active = false WHERE section_key = $1', [section_key]);
    await query('UPDATE site_design SET is_active = true WHERE section_key = $1 AND preset_number = $2', [section_key, preset_number]);
    res.json(await query('SELECT * FROM site_design ORDER BY preset_number'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/site-design/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (key === 'id') continue;
      setClauses.push(`"${key}" = $${i}`);
      values.push(typeof val === 'object' ? JSON.stringify(val) : val);
      i++;
    }
    values.push(req.params.id);
    const [row] = await query(
      `UPDATE site_design SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// SITE SETTINGS
// ══════════════════════════════════════
app.get('/api/site-settings', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM site_settings ORDER BY key');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/site-settings/:key', async (req, res) => {
  try {
    const [row] = await query('SELECT * FROM site_settings WHERE key = $1', [req.params.key]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/site-settings/:key', async (req, res) => {
  try {
    const { value } = req.body;
    const [row] = await query(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW() RETURNING *`,
      [req.params.key, value]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// CUSTOM PAGES
// ══════════════════════════════════════
app.get('/api/custom-pages', async (req, res) => {
  try {
    res.json(await query('SELECT * FROM custom_pages ORDER BY sort_order'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/custom-pages/by-slug/:slug', async (req, res) => {
  try {
    const [row] = await query('SELECT * FROM custom_pages WHERE slug = $1 AND is_published = true', [req.params.slug]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/custom-pages', async (req, res) => {
  try {
    const { slug, title_ka, title_en, content_ka, content_en, page_type, link_url, is_published } = req.body;
    const [row] = await query(
      `INSERT INTO custom_pages (slug, title_ka, title_en, content_ka, content_en, page_type, link_url, is_published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [slug, title_ka, title_en, content_ka, content_en, page_type || 'blank', link_url, is_published !== false]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/custom-pages/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (key === 'id') continue;
      setClauses.push(`"${key}" = $${i}`);
      values.push(val);
      i++;
    }
    values.push(req.params.id);
    const [row] = await query(
      `UPDATE custom_pages SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
      values
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/custom-pages/:id', async (req, res) => {
  try {
    await query('DELETE FROM custom_pages WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// WHO WE ARE
// ══════════════════════════════════════
app.get('/api/who-we-are', async (req, res) => {
  try {
    const [row] = await query('SELECT * FROM who_we_are_content LIMIT 1');
    res.json(row || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/who-we-are', async (req, res) => {
  try {
    const { title_en, title_ka, description_en, description_ka, content_en, content_ka } = req.body;
    const [existing] = await query('SELECT id FROM who_we_are_content LIMIT 1');
    if (existing) {
      const [row] = await query(
        `UPDATE who_we_are_content SET title_en=$1, title_ka=$2, description_en=$3, description_ka=$4, content_en=$5, content_ka=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
        [title_en, title_ka, description_en, description_ka, content_en, content_ka, existing.id]
      );
      res.json(row);
    } else {
      const [row] = await query(
        `INSERT INTO who_we_are_content (title_en, title_ka, description_en, description_ka, content_en, content_ka) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [title_en, title_ka, description_en, description_ka, content_en, content_ka]
      );
      res.json(row);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// FILE UPLOAD (S3/MinIO)
// ══════════════════════════════════════
// Delete with full path (must be before :bucket route)
app.post('/api/upload/delete', async (req, res) => {
  try {
    const { key } = req.body; // full S3 key
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload/:bucket', async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    const fileBuffer = Buffer.from(req.body.file, 'base64');
    const key = `${req.params.bucket}/${Date.now()}-${filename}`;

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType || 'image/jpeg',
    }));

    const publicUrl = `${S3_PUBLIC_BASE}/${key}`;
    res.json({ path: key, url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/upload/:bucket/:key', async (req, res) => {
  try {
    const key = req.params.key;
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: `${req.params.bucket}/${key}` }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// SUB-BRANDS Individual CRUD
// ══════════════════════════════════════
app.delete('/api/sub-brands', async (req, res) => {
  try {
    const { ids } = req.body; // array of IDs to delete
    if (!ids || !ids.length) return res.json({ success: true });
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    await query(`DELETE FROM sub_brands WHERE id IN (${placeholders})`, ids);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/sub-brands/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, val] of Object.entries(fields)) {
      if (key === 'id') continue;
      setClauses.push(`"${key}" = $${i}`);
      values.push(val);
      i++;
    }
    values.push(req.params.id);
    const [row] = await query(
      `UPDATE sub_brands SET ${setClauses.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sub-brands', async (req, res) => {
  try {
    const { company_id, name_ka, name_en, description_ka, description_en, logo_url, website_url, order_position } = req.body;
    const [row] = await query(
      `INSERT INTO sub_brands (company_id, name_ka, name_en, description_ka, description_en, logo_url, website_url, order_position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [company_id, name_ka, name_en, description_ka, description_en, logo_url, website_url, order_position || 0]
    );
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// ADMIN AUTH (simple hardcoded auth)
// ══════════════════════════════════════
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  // Hardcoded admin credentials (matching existing admin login)
  if (email === 'admin' && password === 'Chocheli2024!') {
    res.json({ user: { email: 'admin', role: 'admin' }, token: 'admin-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ══════════════════════════════════════
// SITE SETTINGS - Upsert
// ══════════════════════════════════════
app.post('/api/site-settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    const existing = await query('SELECT * FROM site_settings WHERE key = $1', [key]);
    if (existing.length > 0) {
      const [row] = await query('UPDATE site_settings SET value = $1, updated_at = NOW() WHERE key = $2 RETURNING *', [value, key]);
      res.json(row);
    } else {
      const [row] = await query('INSERT INTO site_settings (key, value) VALUES ($1, $2) RETURNING *', [key, value]);
      res.json(row);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// ADMIN DASHBOARD STATS
// ══════════════════════════════════════
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [newsCount] = await query('SELECT COUNT(*) as count FROM news');
    const [categoriesCount] = await query('SELECT COUNT(*) as count FROM news_categories');
    const [menuCount] = await query('SELECT COUNT(*) as count FROM menu_items');
    const [companiesCount] = await query('SELECT COUNT(*) as count FROM companies');
    res.json({
      news: parseInt(newsCount.count),
      categories: parseInt(categoriesCount.count),
      menuItems: parseInt(menuCount.count),
      companies: parseInt(companiesCount.count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// Health check
// ══════════════════════════════════════
// ══════════════════════════════════════
// Contact Messages API
// ══════════════════════════════════════
app.get('/api/contact-messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    // table might not exist yet — create it
    if (err.code === '42P01') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          name TEXT,
          email TEXT,
          phone TEXT,
          subject TEXT,
          message TEXT,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      res.json([]);
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.post('/api/contact-messages', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        subject TEXT,
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, subject, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/contact-messages/:id/read', async (req, res) => {
  try {
    const result = await pool.query('UPDATE contact_messages SET is_read = TRUE WHERE id = $1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contact-messages/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

// ══════════════════════════════════════
// Panel Admins API
// ══════════════════════════════════════
const ensureAdminsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS panel_admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  // Seed default admin if table is empty
  const { rows } = await pool.query('SELECT COUNT(*) as cnt FROM panel_admins');
  if (parseInt(rows[0].cnt) === 0) {
    await pool.query(
      "INSERT INTO panel_admins (username, password, role) VALUES ('chocheli', 'Panel2025!secure', 'super_admin') ON CONFLICT DO NOTHING"
    );
  }
};

// Paneli Login — checks panel_admins table
app.post('/api/paneli/login', async (req, res) => {
  try {
    await ensureAdminsTable();
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const { rows } = await pool.query(
      'SELECT id, username, role FROM panel_admins WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'არასწორი მომხმარებელი ან პაროლი' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/panel-admins', async (req, res) => {
  try {
    await ensureAdminsTable();
    const result = await pool.query('SELECT id, username, role, created_at, updated_at FROM panel_admins ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/panel-admins', async (req, res) => {
  try {
    await ensureAdminsTable();
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const result = await pool.query(
      'INSERT INTO panel_admins (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      [username, password, role || 'admin']
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/panel-admins/:id', async (req, res) => {
  try {
    await ensureAdminsTable();
    const { username, password, role } = req.body;
    let query, params;
    if (password) {
      query = 'UPDATE panel_admins SET username=$1, password=$2, role=$3, updated_at=NOW() WHERE id=$4 RETURNING id, username, role, updated_at';
      params = [username, password, role || 'admin', req.params.id];
    } else {
      query = 'UPDATE panel_admins SET username=$1, role=$2, updated_at=NOW() WHERE id=$3 RETURNING id, username, role, updated_at';
      params = [username, role || 'admin', req.params.id];
    }
    const result = await pool.query(query, params);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Admin not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/panel-admins/:id', async (req, res) => {
  try {
    await ensureAdminsTable();
    await pool.query('DELETE FROM panel_admins WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// SPA Fallback — serve index.html for all non-API routes
// ══════════════════════════════════════
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ══════════════════════════════════════
// Start server
// ══════════════════════════════════════
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}\n`);
});
