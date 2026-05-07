const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const content = `Release: v${pkg.version}\nBuilt at: ${new Date().toISOString()}\n`;
fs.writeFileSync(path.join(distDir, 'release-notes.txt'), content);
console.log(`Built release-notes.txt for v${pkg.version}`);
