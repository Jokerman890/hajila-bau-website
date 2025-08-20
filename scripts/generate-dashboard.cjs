#!/usr/bin/env node
/**
 * Dashboard Generator (CommonJS)
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = process.cwd();
const STATUS_DIR = path.join(ROOT, 'docs', 'status');
const ASSETS_DIR = path.join(ROOT, 'docs', 'assets');
const IMAGES_DIR = path.join(STATUS_DIR, 'images');

function yyyymm(d = new Date()) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	return `${y}${m}`;
}

async function ensureDir(dir) {
	await fsp.mkdir(dir, { recursive: true });
}

function parseKeyValueCsv(text) {
	const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
	const map = new Map();
	for (const line of lines) {
		const parts = line.split(',');
		if (parts.length < 2) continue;
		const key = parts[0].replace(/^\s*"|"\s*$/g, '').trim();
		const value = parts.slice(1).join(',').replace(/^\s*"|"\s*$/g, '').trim();
		map.set(key, value);
	}
	return map;
}

function parseGenericCsv(text) {
	const lines = text.split(/\r?\n/).filter(Boolean);
	const rows = lines.map(l => {
		const cols = [];
		let cur = '';
		let inQuotes = false;
		for (let i = 0; i < l.length; i++) {
			const c = l[i];
			if (c === '"') {
				inQuotes = !inQuotes;
				continue;
			}
			if (c === ',' && !inQuotes) {
				cols.push(cur);
				cur = '';
			} else {
				cur += c;
			}
		}
		cols.push(cur);
		return cols;
	});
	return rows;
}

function createBarSvg({ labels, values, width = 800, height = 240, title = '' }) {
	const max = Math.max.apply(null, values.concat(1));
	const barAreaWidth = width - 220;
	const barHeight = Math.max(12, Math.floor((height - 40) / labels.length));
	const gap = 8;
	const totalHeight = Math.max(height, labels.length * (barHeight + gap) + 40);

	const rows = labels.map(function(label, i) {
		const v = Number(values[i] || 0);
		const w = Math.round((v / max) * barAreaWidth);
		const y = 30 + i * (barHeight + gap);
		return { label: label, v: v, w: w, y: y };
	});

	var svgRows = rows.map(function(r) {
		return '\n    <g>\n      <text x="10" y="' + (r.y + barHeight - 3) + '" font-family="sans-serif" font-size="12">' + escapeHtml(r.label) + '</text>\n      <rect x="200" y="' + r.y + '" width="' + r.w + '" height="' + barHeight + '" fill="#3b82f6" rx="3"></rect>\n      <text x="' + (200 + r.w + 8) + '" y="' + (r.y + barHeight - 3) + '" font-family="sans-serif" font-size="12">' + r.v + '</text>\n    </g>';
	}).join('\n');

	var svg = '<?xml version="1.0" encoding="utf-8"?>\n  <svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + totalHeight + '" viewBox="0 0 ' + width + ' ' + totalHeight + '">\n    <rect width="100%" height="100%" fill="#ffffff" />\n    <text x="10" y="16" font-family="sans-serif" font-size="14" font-weight="600">' + escapeHtml(title) + '</text>\n    ' + svgRows + '\n  </svg>';
	return svg;
}

function escapeHtml(s) {
	return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function findLatestStatusCsv() {
	var files = [];
	try { files = await fsp.readdir(STATUS_DIR); } catch { files = []; }
	var candidates = files.filter(function(f) { return /^status-\d{6}\.csv$/.test(f); }).sort().reverse();
	if (candidates.length) return path.join(STATUS_DIR, candidates[0]);
	var file = path.join(STATUS_DIR, 'status-' + yyyymm() + '.csv');
	return fs.existsSync(file) ? file : null;
}

async function readCsvIf(filePath) {
	try { return await fsp.readFile(filePath, 'utf8'); } catch { return null; }
}

async function main() {
	await ensureDir(IMAGES_DIR);

	var statusCsv = await findLatestStatusCsv();
	var status = {};
	if (statusCsv) {
		var text = await readCsvIf(statusCsv);
		if (text) {
			var map = parseKeyValueCsv(text);
			for (var entry of map.entries()) status[entry[0]] = entry[1];
		}
	}

	var duplicatesCsv = path.join(ASSETS_DIR, 'duplicates.csv');
	var orphanedCsv = path.join(ASSETS_DIR, 'orphaned.csv');
	var largeCsv = path.join(ASSETS_DIR, 'large-images.csv');

	var dupText = await readCsvIf(duplicatesCsv);
	var orpText = await readCsvIf(orphanedCsv);
	var largeText = await readCsvIf(largeCsv);

	var dupCount = dupText ? Math.max(0, parseGenericCsv(dupText).length - 1) : 0;
	var orphanCount = orpText ? Math.max(0, parseGenericCsv(orpText).length - 1) : 0;
	var largeCount = largeText ? Math.max(0, parseGenericCsv(largeText).length - 1) : 0;

	var month = status.month || yyyymm();

	var labels = ['duplicate_groups', 'duplicate_entries', 'orphaned_files', 'large_images'];
	var values = [Number(status.duplicate_groups || 0), Number(status.duplicate_entries || dupCount), Number(status.orphaned_files || orphanCount), Number(status.large_images || largeCount)];

	var summarySvg = createBarSvg({ labels: ['Duplicate Groups','Duplicate Entries','Orphaned Files','Large Images'], values: values, width: 900, height: Math.max(240, labels.length * 34), title: 'KPIs – ' + month });
	var summarySvgPath = path.join(IMAGES_DIR, 'kpi-summary-' + month + '.svg');
	await fsp.writeFile(summarySvgPath, summarySvg, 'utf8');

	var topLargeMd = '_Keine Daten verfügbar_';
	if (largeText) {
		var rows = parseGenericCsv(largeText);
		if (rows.length > 1) {
			var items = rows.slice(1).map(function(r) { return { path: r[0], sizeKB: r[2] || r[1] || '' }; });
			var top = items.slice(0, 10);
			topLargeMd = top.map(function(it, i) { return (i+1) + '. ' + it.path + ' – ' + it.sizeKB + ' KB'; }).join('\n');
		}
	}

	var md = [
		'# Status Dashboard – ' + month,
		'',
		'## KPIs',
		'',
		'![KPI Summary](' + path.relative(STATUS_DIR, summarySvgPath).replace(/\\/g, '/') + ')',
		'',
		'### Zahlen',
		'',
		'- Duplicate Groups: ' + (status.duplicate_groups || '0'),
		'- Duplicate Entries: ' + (status.duplicate_entries || dupCount),
		'- Orphaned Files: ' + (status.orphaned_files || orphanCount),
		'- Large Images: ' + (status.large_images || largeCount),
		'',
		'## Top große Bilder',
		'',
		topLargeMd,
		'',
		'## Quellen',
		'',
		'- `docs/assets/duplicates.csv`',
		'- `docs/assets/orphaned.csv`',
		'- `docs/assets/large-images.csv`',
		'',
		'## Hinweise',
		'',
		'- SVG-Charts sind einfach gerendert (keine externe Bibliothek).',
		'- Wenn du PNGs brauchst, kannst du Puppeteer nutzen, um SVG zu PNG zu konvertieren in CI.',
		''
	].join('\n');

	var outPath = path.join(STATUS_DIR, 'dashboard-README.md');
	await fsp.writeFile(outPath, md, 'utf8');

	console.log('Dashboard generiert:');
	console.log(' - ' + path.relative(ROOT, outPath));
	console.log(' - ' + path.relative(ROOT, summarySvgPath));
}

main().catch(function(err) {
	void err;
	console.error('Fehler beim Dashboard-Generator; siehe Log');
	process.exit(1);
});
