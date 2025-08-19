// Dieses Skript prüft, ob alle in data/carousel-images.json gelisteten Bilder im Ordner public/uploads/carousel/ existieren
const fs = require('fs');
const path = require('path');

const jsonFile = path.join(__dirname, '../data/carousel-images.json');
const carouselDir = path.join(__dirname, '../public/uploads/carousel');

if (!fs.existsSync(jsonFile)) {
  console.error('carousel-images.json nicht gefunden!');
  process.exit(1);
}

const images = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
const missing = [];

for (const img of images) {
  // Entferne führenden Slash für Pfadvergleich
  const filePath = path.join(carouselDir, img.src.replace(/^\//, '').replace('uploads/carousel/', ''));
  if (!fs.existsSync(filePath)) {
    missing.push(img.src);
  }
}

if (missing.length === 0) {
  console.log('Alle Bilder aus carousel-images.json sind im Ordner vorhanden!');
} else {
  console.warn('Fehlende Bilder:');
  for (const m of missing) {
    console.warn('  -', m);
  }
  process.exit(2);
}
