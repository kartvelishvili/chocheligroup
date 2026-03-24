/**
 * Setup Supabase Storage RLS policies for news-images bucket
 * Run: node setup-storage-policies.mjs
 * 
 * This creates the necessary INSERT/UPDATE/DELETE policies so that
 * the anon key can upload images.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://deqympqjroyzuxcmzotf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcXltcHFqcm95enV4Y216b3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzY5MDEsImV4cCI6MjA4NDY1MjkwMX0.vTuZoA6rT8E_IrjbxVrCGUs9DlhrgkjMSZg0T_QQ4L0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupPolicies() {
  console.log('=== Setting up Storage RLS Policies ===\n');

  // These SQL statements create policies for the news-images bucket
  // They need to be run with a service_role key or from the Supabase SQL Editor
  
  const policies = [
    {
      name: 'Allow public read access on news-images',
      sql: `CREATE POLICY "Allow public read news-images" ON storage.objects FOR SELECT USING (bucket_id = 'news-images');`
    },
    {
      name: 'Allow public insert on news-images', 
      sql: `CREATE POLICY "Allow public insert news-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'news-images');`
    },
    {
      name: 'Allow public update on news-images',
      sql: `CREATE POLICY "Allow public update news-images" ON storage.objects FOR UPDATE USING (bucket_id = 'news-images');`
    },
    {
      name: 'Allow public delete on news-images',
      sql: `CREATE POLICY "Allow public delete news-images" ON storage.objects FOR DELETE USING (bucket_id = 'news-images');`
    }
  ];

  console.log('⚠️  These policies cannot be created with the anon key.');
  console.log('   You need to run these SQL statements in Supabase Dashboard → SQL Editor:\n');
  
  console.log('──────────────────────────────────────────');
  console.log('-- Copy everything below and paste into SQL Editor:');
  console.log('──────────────────────────────────────────\n');
  
  for (const policy of policies) {
    console.log(`-- ${policy.name}`);
    console.log(policy.sql);
    console.log('');
  }

  console.log('──────────────────────────────────────────\n');

  // Attempt to run via RPC (will likely fail with anon key, but let's try)
  console.log('Attempting to create policies via anon key (likely will fail)...\n');
  
  for (const policy of policies) {
    const { error } = await supabase.rpc('exec_sql', { sql: policy.sql }).single();
    if (error) {
      // Try direct query approach
      const { error: err2 } = await supabase.from('_exec').select().limit(0);
      console.log(`  ❌ ${policy.name}: Cannot execute DDL with anon key (expected)`);
    } else {
      console.log(`  ✅ ${policy.name}: Created!`);
    }
  }

  console.log('\n📋 INSTRUCTIONS:');
  console.log('   1. Go to https://supabase.com/dashboard → Your Project');
  console.log('   2. Go to SQL Editor (left sidebar)');
  console.log('   3. Paste the SQL statements above');
  console.log('   4. Click "Run"');
  console.log('   5. Then run: node debug-upload.mjs  to verify\n');
}

setupPolicies().catch(console.error);
