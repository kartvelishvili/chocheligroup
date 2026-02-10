/**
 * Debug script: Test Supabase Storage upload directly
 * Run: node debug-upload.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';

const supabaseUrl = 'https://deqympqjroyzuxcmzotf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcXltcHFqcm95enV4Y216b3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzY5MDEsImV4cCI6MjA4NDY1MjkwMX0.vTuZoA6rT8E_IrjbxVrCGUs9DlhrgkjMSZg0T_QQ4L0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
  console.log('=== SUPABASE STORAGE DEBUG ===\n');

  // Step 1: List buckets
  console.log('1. Listing all buckets...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.error('   ❌ listBuckets error:', bucketsError);
  } else {
    console.log('   ✅ Buckets:', buckets.map(b => `${b.name} (public: ${b.public})`).join(', '));
  }

  // Step 2: List existing files in news-images
  console.log('\n2. Listing files in news-images/news/ ...');
  const { data: files, error: listError } = await supabase.storage
    .from('news-images')
    .list('news', { limit: 10 });
  if (listError) {
    console.error('   ❌ list error:', listError);
  } else {
    console.log(`   ✅ Found ${files.length} files:`, files.map(f => f.name).join(', ') || '(empty)');
  }

  // Step 3: Create a tiny 1x1 red PNG image (valid PNG file)
  // This is a minimal valid PNG: 1x1 pixel, red color
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    0x00, 0x00, 0x00, 0x0d, // IHDR length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02,             // bit depth: 8, color type: RGB
    0x00, 0x00, 0x00,       // compression, filter, interlace
    0x90, 0x77, 0x53, 0xde, // IHDR CRC
    0x00, 0x00, 0x00, 0x0c, // IDAT length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00, 0x00,
    0x00, 0x02, 0x00, 0x01, // compressed data
    0xe2, 0x21, 0xbc, 0x33, // IDAT CRC
    0x00, 0x00, 0x00, 0x00, // IEND length
    0x49, 0x45, 0x4e, 0x44, // IEND
    0xae, 0x42, 0x60, 0x82  // IEND CRC
  ]);

  const testFileName = `news/debug-test-${Date.now()}.png`;
  console.log(`\n3. Uploading test image to: ${testFileName}`);
  console.log(`   File size: ${pngHeader.length} bytes`);
  console.log(`   Content-Type: image/png`);

  // Step 4: Try upload WITHOUT contentType
  console.log('\n4a. Upload attempt (no explicit contentType)...');
  const { data: up1, error: upErr1 } = await supabase.storage
    .from('news-images')
    .upload(testFileName + '-v1', pngHeader, {
      cacheControl: '3600',
      upsert: false,
    });
  if (upErr1) {
    console.error('   ❌ Upload failed:', JSON.stringify(upErr1, null, 2));
  } else {
    console.log('   ✅ Upload success:', up1);
  }

  // Step 4b: Try upload WITH contentType
  console.log('\n4b. Upload attempt (with contentType: image/png)...');
  const { data: up2, error: upErr2 } = await supabase.storage
    .from('news-images')
    .upload(testFileName + '-v2', pngHeader, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/png'
    });
  if (upErr2) {
    console.error('   ❌ Upload failed:', JSON.stringify(upErr2, null, 2));
  } else {
    console.log('   ✅ Upload success:', up2);
  }

  // Step 4c: Try upload with upsert: true
  console.log('\n4c. Upload attempt (upsert: true)...');
  const { data: up3, error: upErr3 } = await supabase.storage
    .from('news-images')
    .upload(testFileName + '-v3', pngHeader, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/png'
    });
  if (upErr3) {
    console.error('   ❌ Upload failed:', JSON.stringify(upErr3, null, 2));
  } else {
    console.log('   ✅ Upload success:', up3);
  }

  // Step 5: Try getPublicUrl
  console.log('\n5. Getting public URL...');
  const { data: urlData } = supabase.storage
    .from('news-images')
    .getPublicUrl(testFileName + '-v2');
  console.log('   Public URL:', urlData.publicUrl);

  // Step 6: Try fetching the public URL
  console.log('\n6. Fetching the public URL to check if it works...');
  try {
    const resp = await fetch(urlData.publicUrl);
    console.log(`   HTTP ${resp.status} ${resp.statusText}`);
    console.log(`   Content-Type: ${resp.headers.get('content-type')}`);
    if (resp.status !== 200) {
      const body = await resp.text();
      console.log('   Body:', body.substring(0, 200));
    } else {
      console.log('   ✅ Image is publicly accessible!');
    }
  } catch (fetchErr) {
    console.error('   ❌ Fetch error:', fetchErr.message);
  }

  // Step 7: Check RLS policies by trying to read
  console.log('\n7. Listing files after upload...');
  const { data: files2, error: listErr2 } = await supabase.storage
    .from('news-images')
    .list('news', { limit: 10, sortBy: { column: 'created_at', order: 'desc' } });
  if (listErr2) {
    console.error('   ❌ list error:', listErr2);
  } else {
    console.log(`   ✅ Files (${files2.length}):`, files2.map(f => `${f.name} (${f.metadata?.size || '?'} bytes)`).join('\n     '));
  }

  console.log('\n=== DEBUG COMPLETE ===');
}

testUpload().catch(console.error);
