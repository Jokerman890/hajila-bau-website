// Dieses Skript liest alle Bilddateien aus public/uploads/carousel/ und schreibt sie als JSON-Liste nach data/carousel-images.json
const fs = require('fs');
const path = require('path');

const carouselDir = path.join(__dirname, '../public/uploads/carousel');
const outputFile = path.join(__dirname, '../data/carousel-images.json');

const files = fs.readdirSync(carouselDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
const images = files.map((file, idx) => ({
  id: String(idx + 1),
  src: `/uploads/carousel/${file}`,
  alt: `Referenzprojekt ${idx + 1}`
}));

fs.writeFileSync(outputFile, JSON.stringify(images, null, 2));
console.log(`Wrote ${images.length} images to ${outputFile}`);
