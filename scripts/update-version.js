const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../src/version.ts');
const changelog = fs.readFileSync(path.join(__dirname, '../CHANGELOG.md'), 'utf-8');
const match = changelog.match(/## \[(\d+\.\d+\.\d+)\]/);
const version = match ? match[1] : '0.0.0';
const buildDate = new Date().toISOString().slice(0, 10);

const content = `export const APP_VERSION = "${version}";\nexport const APP_BUILD_DATE = "${buildDate}";\n`;
fs.writeFileSync(versionFile, content);
console.log('Version und Build-Datum aktualisiert:', version, buildDate);
