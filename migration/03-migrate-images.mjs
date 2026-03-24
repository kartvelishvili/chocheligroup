/**
 * Step 3: Download ALL images from external sources + Supabase Storage
 *         Then upload them all to iHost.ge MinIO S3
 *         Returns a URL mapping (old → new) for later code replacement
 */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

const OUTPUT_DIR = path.join(import.meta.dirname, 'downloaded-images');
const MAPPING_FILE = path.join(import.meta.dirname, 'url-mapping.json');

const S3_ENDPOINT = 'https://s3.ihost.ge';
const S3_BUCKET = 'site-chocheligroup-com';
const S3_ACCESS_KEY = 'c5UmA8HhmX3DlnVh';
const S3_SECRET_KEY = 'cYo6elo8QRLG62VsN70CQcl4iAufZDOH';
const S3_REGION = 'us-east-1';
const S3_PUBLIC_BASE = 'https://s3.ihost.ge/site-chocheligroup-com';

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

// All image URLs to migrate (from codebase analysis)
const IMAGE_URLS = [
  // postimg.cc images
  'https://i.postimg.cc/Z5xzM8Sj/chocheli-group.jpg',
  'https://i.postimg.cc/NjShFTxL/506854830-10013410878742299-1013126184738099367-n.jpg',
  'https://i.postimg.cc/26DT3SSz/chocheli-shalva.jpg',
  'https://i.postimg.cc/5N6GBNpc/saba-chocheli.jpg',
  'https://i.postimg.cc/s2XRbv8m/506208349-10020878614662192-2846366780113441950-n.jpg',
  'https://i.postimg.cc/L5fSvwW3/506835830-10014646511952069-4363242619380959237-n.jpg',
  'https://i.postimg.cc/x1g2sKsX/505897957-10014646788618708-2502156204642059171-n.jpg',
  'https://i.postimg.cc/SsYbNHmb/506372066-10013430508740336-349768235636487541-n.jpg',
  'https://i.postimg.cc/0jgR6ZNb/506648127-10020319648051422-783754334374978744-n.jpg',
  'https://i.postimg.cc/66RNssH4/508447183-10045627062187347-4692553886682053883-n.jpg',
  'https://i.postimg.cc/BQ0f4hkq/508418937-10043544265728960-2290390415442953318-n.jpg',
  'https://i.postimg.cc/FFbXMWZV/gabala1.png',
  'https://i.postimg.cc/yxK4JcVb/gabala2.png',
  'https://i.postimg.cc/5ymc8yyt/gabala3.png',
  'https://i.postimg.cc/1Xkj63nR/IMG-7536.jpg',
  'https://i.postimg.cc/RZtxF2Yn/digomi.jpg',
  'https://i.postimg.cc/rw6Y2ZqF/487159953-2050001892172767-7132622880610579273-n.jpg',
  'https://i.postimg.cc/Vkj4Tx4c/byd.jpg',
  'https://i.postimg.cc/L5LNpGRP/byd-center-georgia.jpg',
  'https://i.postimg.cc/Bb9BMNDQ/488862252-122098360130829380-6885269894959734391-n.jpg',
  'https://i.postimg.cc/ZYdMshSz/dayli-group.jpg',
  'https://i.postimg.cc/25yH4swv/400-5c387a4c6b455.png',
  'https://i.postimg.cc/bNP36DT7/magniti.jpg',
  'https://i.postimg.cc/PrKz26Ps/barambo.jpg',
  'https://i.postimg.cc/fTHmxJrN/Logo-natakhtari-e.jpg',
  'https://i.postimg.cc/BQ9F76vR/chocheli-investment-logo.png',
  'https://i.postimg.cc/8z5hCcGp/smarketer-white.webp',
  'https://i.postimg.cc/VL1Q8h7y/tsezar-chocheli.png',
  'https://i.postimg.cc/TP9vNvMq/byd-georgia.jpg',
  'https://i.postimg.cc/Hk1GpkTw/ev-track.jpg',
  'https://i.postimg.cc/L8JqMv6h/byd.jpg',
  'https://i.postimg.cc/J4LDJGR0/A45CD3DA-B895-4DF5-906E-E09B253D7668.jpg',
  'https://i.postimg.cc/3xVYX4v9/IMG-7716.jpg',
  // imgur images
  'https://i.imgur.com/ndHKw5O.png',
  'https://i.imgur.com/Qf1QqrH.png',
  'https://i.imgur.com/PH8paD2.png',
  'https://i.imgur.com/9P0fiWj.png',
  'https://i.imgur.com/NaSOSmn.png',
  // unsplash images
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
  // External brand logos
  'https://zedazeni.ge/assets/svg/logo_symbol.svg',
  'https://kshop.ge/files/logo/bUiRWuxzVMXZD6rHfIv51hNdcTG0e1.png',
  // Supabase Storage image
  'https://deqympqjroyzuxcmzotf.supabase.co/storage/v1/object/public/news-images/news/1771118164623-meeting1__1__jpg.jpg',
];

function getExtFromUrl(url) {
  const pathname = new URL(url.split('?')[0]).pathname;
  const ext = path.extname(pathname);
  return ext || '.jpg';
}

function getSafeFilename(url) {
  const parsed = new URL(url.split('?')[0]);
  let name = path.basename(parsed.pathname);
  // Clean up the name
  name = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!name || name === '_') name = 'image_' + Date.now();
  return name;
}

function getS3Key(url) {
  // Categorize images into folders
  if (url.includes('supabase.co/storage')) {
    const match = url.match(/news-images\/(.+)/);
    return match ? `news/${match[1]}` : `news/${getSafeFilename(url)}`;
  }
  if (url.includes('unsplash.com')) return `stock/${getSafeFilename(url)}${getExtFromUrl(url)}`;
  if (url.includes('imgur.com')) return `brands/${getSafeFilename(url)}`;
  if (url.includes('zedazeni.ge') || url.includes('kshop.ge')) return `logos/${getSafeFilename(url)}`;

  const filename = getSafeFilename(url);
  // Categorize by content
  if (filename.match(/logo|chocheli-investment/i)) return `logos/${filename}`;
  if (filename.match(/smarketer/i)) return `logos/${filename}`;
  if (filename.match(/gabala|digomi|IMG-7536/i)) return `projects/${filename}`;
  if (filename.match(/founder|tsezar|shalva|saba|506208|506835|505897|506372|506648|508447|508418/i)) return `founder/${filename}`;
  if (filename.match(/byd|barambo|magniti|natakhtari|dayli|knauf|ev-track/i)) return `companies/${filename}`;
  return `images/${filename}`;
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const request = (reqUrl, redirectCount = 0) => {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      client.get(reqUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, reqUrl).href;
          const redirectClient = redirectUrl.startsWith('https') ? https : http;
          redirectClient.get(redirectUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
            if (res2.statusCode >= 300 && res2.statusCode < 400 && res2.headers.location) {
              request(res2.headers.location.startsWith('http') ? res2.headers.location : new URL(res2.headers.location, redirectUrl).href, redirectCount + 2);
            } else {
              const chunks = [];
              res2.on('data', c => chunks.push(c));
              res2.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res2.headers['content-type'] || 'image/jpeg' }));
              res2.on('error', reject);
            }
          }).on('error', reject);
          return;
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] || 'image/jpeg' }));
        res.on('error', reject);
      }).on('error', reject);
    };
    request(url);
  });
}

function getMimeType(ext) {
  const map = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  };
  return map[ext.toLowerCase()] || 'image/jpeg';
}

async function main() {
  console.log('🚀 Starting image migration...\n');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Test S3 connection
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
    console.log('✅ Connected to MinIO S3 bucket\n');
  } catch (err) {
    console.error('❌ Cannot access S3 bucket:', err.message);
    process.exit(1);
  }

  const urlMapping = {};
  let success = 0;
  let failed = 0;

  for (const url of IMAGE_URLS) {
    const s3Key = getS3Key(url);
    const localFile = path.join(OUTPUT_DIR, s3Key.replace(/\//g, '_'));

    process.stdout.write(`  ${getSafeFilename(url).substring(0, 40).padEnd(40)} `);

    try {
      // Download
      const { buffer, contentType } = await downloadFile(url);
      fs.writeFileSync(localFile, buffer);

      // Upload to MinIO
      const ext = path.extname(s3Key) || getExtFromUrl(url);
      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: buffer,
        ContentType: contentType || getMimeType(ext),
      }));

      const newUrl = `${S3_PUBLIC_BASE}/${s3Key}`;
      urlMapping[url] = newUrl;
      console.log(`✅ → ${s3Key}`);
      success++;
    } catch (err) {
      console.log(`❌ ${err.message.substring(0, 60)}`);
      failed++;
    }
  }

  // Save URL mapping
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(urlMapping, null, 2), 'utf-8');

  console.log(`\n═══════════════════════════════════`);
  console.log(`Image Migration Summary:`);
  console.log(`  ✅ Success: ${success}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📄 URL mapping: ${MAPPING_FILE}`);
  console.log(`═══════════════════════════════════\n`);
}

main().catch(console.error);
