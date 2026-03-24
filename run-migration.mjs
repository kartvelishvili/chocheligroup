import pg from 'pg';
import { readFileSync } from 'fs';

const { Client } = pg;

import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

// Fly.io-based Supabase project (IPv6 only direct connection)
const configs = [
  // Fly.io pooler endpoints (most likely for IPv6-only projects)
  { name: 'Fly-IAD', host: 'fly-0-iad.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-FRA', host: 'fly-0-fra.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-SJC', host: 'fly-0-sjc.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-LHR', host: 'fly-0-lhr.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-CDG', host: 'fly-0-cdg.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-AMS', host: 'fly-0-ams.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-SIN', host: 'fly-0-sin.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-NRT', host: 'fly-0-nrt.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-SYD', host: 'fly-0-syd.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-GRU', host: 'fly-0-gru.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-MAA', host: 'fly-0-maa.pooler.supabase.com', port: 6543, user: 'postgres.deqympqjroyzuxcmzotf' },
  // Session mode on port 5432
  { name: 'Fly-IAD-5432', host: 'fly-0-iad.pooler.supabase.com', port: 5432, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-FRA-5432', host: 'fly-0-fra.pooler.supabase.com', port: 5432, user: 'postgres.deqympqjroyzuxcmzotf' },
  { name: 'Fly-SJC-5432', host: 'fly-0-sjc.pooler.supabase.com', port: 5432, user: 'postgres.deqympqjroyzuxcmzotf' },
];

async function run() {
  const sql = readFileSync('./supabase-migration.sql', 'utf-8');

  for (const cfg of configs) {
    const client = new Client({
      host: cfg.host,
      port: cfg.port,
      database: 'postgres',
      user: cfg.user,
      password: 'Qartvela2786.',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });

    try {
      console.log(`Trying ${cfg.name} (${cfg.user}@${cfg.host}:${cfg.port})...`);
      await client.connect();
      console.log('Connected! Running migration...');
      await client.query(sql);
      console.log('Migration completed successfully!');
      const res = await client.query('SELECT section_key, title FROM public.site_content ORDER BY section_key');
      console.log(`\nCreated ${res.rows.length} sections:`);
      res.rows.forEach(r => console.log(`  - ${r.section_key}: ${r.title}`));
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
      try { await client.end(); } catch(_) {}
    }
  }
  console.log('\nAll connection attempts failed.');
}

run();
