const fs = require('fs');
const path = require('path');
const mapping = JSON.parse(fs.readFileSync('migration/url-mapping.json', 'utf8'));

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== '_backup' && file !== 'node_modules') results = results.concat(walkDir(filePath));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(filePath);
    }
  }
  return results;
}

const files = walkDir('src');
let totalReplacements = 0;
let filesModified = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [oldUrl, newUrl] of Object.entries(mapping)) {
    if (content.includes(oldUrl)) {
      content = content.split(oldUrl).join(newUrl);
      totalReplacements++;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    filesModified++;
    console.log('Modified:', filePath);
  }
}

console.log('Total URL patterns replaced:', totalReplacements);
console.log('Files modified:', filesModified);
