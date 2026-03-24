/**
 * Step 1: Export ALL data from Supabase database
 * Uses Supabase REST API to fetch all tables
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const supabaseUrl = 'https://deqympqjroyzuxcmzotf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcXltcHFqcm95enV4Y216b3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzY5MDEsImV4cCI6MjA4NDY1MjkwMX0.vTuZoA6rT8E_IrjbxVrCGUs9DlhrgkjMSZg0T_QQ4L0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLES = [
  'companies',
  'sub_brands',
  'brands',
  'news',
  'news_categories',
  'menu_items',
  'site_content',
  'site_design',
  'site_settings',
  'custom_pages',
  'who_we_are_content',
];

const OUTPUT_DIR = path.join(import.meta.dirname, 'exported-data');

async function exportTable(tableName) {
  console.log(`  Exporting ${tableName}...`);
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(10000);
  
  if (error) {
    console.error(`  ❌ Error exporting ${tableName}:`, error.message);
    return { table: tableName, count: 0, error: error.message };
  }
  
  const filePath = path.join(OUTPUT_DIR, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✅ ${tableName}: ${data.length} rows`);
  return { table: tableName, count: data.length, error: null };
}

async function exportStorageFiles() {
  console.log('\n📂 Exporting Supabase Storage file lists...');
  const buckets = ['news-images', 'brand-images', 'site-assets'];
  const allFiles = {};
  
  for (const bucket of buckets) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', { limit: 1000 });
    
    if (error) {
      console.error(`  ❌ Error listing ${bucket}:`, error.message);
      allFiles[bucket] = [];
      continue;
    }
    
    // Recursively list all files
    const files = [];
    for (const item of (data || [])) {
      if (item.id) {
        files.push(item.name);
      } else {
        // It's a folder, list its contents
        const { data: subData } = await supabase.storage
          .from(bucket)
          .list(item.name, { limit: 1000 });
        if (subData) {
          for (const subItem of subData) {
            files.push(`${item.name}/${subItem.name}`);
          }
        }
      }
    }
    
    allFiles[bucket] = files;
    console.log(`  ✅ ${bucket}: ${files.length} files`);
  }
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, '_storage_files.json'),
    JSON.stringify(allFiles, null, 2),
    'utf-8'
  );
  return allFiles;
}

async function main() {
  console.log('🚀 Exporting data from Supabase...\n');
  
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  console.log('📊 Exporting tables:');
  const results = [];
  for (const table of TABLES) {
    const result = await exportTable(table);
    results.push(result);
  }
  
  const storageFiles = await exportStorageFiles();
  
  console.log('\n═══════════════════════════════════');
  console.log('Export Summary:');
  for (const r of results) {
    const status = r.error ? `❌ ${r.error}` : `✅ ${r.count} rows`;
    console.log(`  ${r.table}: ${status}`);
  }
  
  const totalFiles = Object.values(storageFiles).flat().length;
  console.log(`  Storage files: ${totalFiles} total`);
  console.log('═══════════════════════════════════\n');
  console.log(`📁 Data saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
