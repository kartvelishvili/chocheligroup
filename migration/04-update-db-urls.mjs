/**
 * Step 4: Update all image URLs in iHost.ge PostgreSQL database
 *         Uses the URL mapping from step 3
 */
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';

const { Client } = pg;
const MAPPING_FILE = path.join(import.meta.dirname, 'url-mapping.json');

const client = new Client({
  connectionString: 'postgresql://user_chocheligroup_com:ucAkwqqJ23RJmpUV3LCM@194.163.172.62:5432/site_chocheligroup_com',
  ssl: false,
});

async function main() {
  const urlMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  console.log(`📋 Loaded ${Object.keys(urlMapping).length} URL mappings\n`);

  await client.connect();
  console.log('✅ Connected to iHost.ge PostgreSQL\n');

  let totalUpdated = 0;

  // 1. Update companies.logo_url
  console.log('📊 Updating companies...');
  for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
    const res = await client.query(
      'UPDATE companies SET logo_url = $1 WHERE logo_url = $2',
      [newUrl, oldUrl]
    );
    if (res.rowCount > 0) {
      console.log(`  ✅ companies.logo_url: ${res.rowCount} row(s)`);
      totalUpdated += res.rowCount;
    }
  }

  // 2. Update sub_brands.logo_url and website_url (some website_url contain image URLs)
  console.log('📊 Updating sub_brands...');
  for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
    let res = await client.query(
      'UPDATE sub_brands SET logo_url = $1 WHERE logo_url = $2',
      [newUrl, oldUrl]
    );
    if (res.rowCount > 0) {
      console.log(`  ✅ sub_brands.logo_url: ${res.rowCount} row(s)`);
      totalUpdated += res.rowCount;
    }
    res = await client.query(
      'UPDATE sub_brands SET website_url = $1 WHERE website_url = $2',
      [newUrl, oldUrl]
    );
    if (res.rowCount > 0) {
      console.log(`  ✅ sub_brands.website_url: ${res.rowCount} row(s)`);
      totalUpdated += res.rowCount;
    }
  }

  // 3. Update news.image_url
  console.log('📊 Updating news...');
  for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
    const res = await client.query(
      'UPDATE news SET image_url = $1 WHERE image_url = $2',
      [newUrl, oldUrl]
    );
    if (res.rowCount > 0) {
      console.log(`  ✅ news.image_url: ${res.rowCount} row(s)`);
      totalUpdated += res.rowCount;
    }
  }

  // 4. Update site_content JSONB - replace URLs inside content JSON
  console.log('📊 Updating site_content (JSONB)...');
  const { rows: contentRows } = await client.query('SELECT id, section_key, content FROM site_content');
  for (const row of contentRows) {
    let contentStr = JSON.stringify(row.content);
    let changed = false;
    for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
      if (contentStr.includes(oldUrl)) {
        contentStr = contentStr.split(oldUrl).join(newUrl);
        changed = true;
      }
    }
    if (changed) {
      await client.query(
        'UPDATE site_content SET content = $1::jsonb WHERE id = $2',
        [contentStr, row.id]
      );
      console.log(`  ✅ site_content: ${row.section_key}`);
      totalUpdated++;
    }
  }

  // 5. Update who_we_are_content (check for image URLs in text fields)
  console.log('📊 Updating who_we_are_content...');
  const { rows: whoRows } = await client.query('SELECT * FROM who_we_are_content');
  for (const row of whoRows) {
    const textCols = ['title_en', 'title_ka', 'description_en', 'description_ka', 'content_en', 'content_ka'];
    for (const col of textCols) {
      if (!row[col]) continue;
      let val = row[col];
      let changed = false;
      for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
        if (val.includes(oldUrl)) {
          val = val.split(oldUrl).join(newUrl);
          changed = true;
        }
      }
      if (changed) {
        await client.query(`UPDATE who_we_are_content SET "${col}" = $1 WHERE id = $2`, [val, row.id]);
        console.log(`  ✅ who_we_are_content.${col}`);
        totalUpdated++;
      }
    }
  }

  // 6. Update brands.logo_url
  console.log('📊 Updating brands...');
  for (const [oldUrl, newUrl] of Object.entries(urlMapping)) {
    const res = await client.query(
      'UPDATE brands SET logo_url = $1 WHERE logo_url = $2',
      [newUrl, oldUrl]
    );
    if (res.rowCount > 0) {
      console.log(`  ✅ brands.logo_url: ${res.rowCount} row(s)`);
      totalUpdated += res.rowCount;
    }
  }

  console.log(`\n═══════════════════════════════════`);
  console.log(`✅ Total database updates: ${totalUpdated}`);
  console.log(`═══════════════════════════════════\n`);

  await client.end();
}

main().catch(err => {
  console.error('❌ Failed:', err.message);
  client.end();
  process.exit(1);
});
