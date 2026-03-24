const fs = require('fs');
const dir = 'migration/exported-data';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json') && f[0] !== '_')) {
  const data = JSON.parse(fs.readFileSync(dir+'/'+f, 'utf-8'));
  if (data.length > 0) {
    console.log('=== ' + f.replace('.json','') + ' ===');
    const row = data[0];
    for (const [k,v] of Object.entries(row)) {
      const type = v === null ? 'NULL' : typeof v;
      const preview = typeof v === 'string' ? v.substring(0,50) : (typeof v === 'object' && v !== null ? JSON.stringify(v).substring(0,50) : String(v));
      console.log('  ' + k + ': ' + type + ' => ' + preview);
    }
    console.log('');
  }
}
