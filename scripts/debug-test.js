// Debug-Skript zur Überprüfung der Testumgebung
const fs = require('fs');
const path = require('path');

console.log('=== Testumgebungs-Debugger ===');

// 1. Überprüfe Node.js Version
console.log('Node.js Version:', process.version);

// 2. Überprüfe aktuelles Arbeitsverzeichnis
console.log('Aktuelles Verzeichnis:', process.cwd());

// 3. Überprüfe Dateisystemzugriff
try {
  const testFile = path.join(__dirname, 'debug-test-file.txt');
  fs.writeFileSync(testFile, 'Test');
  void fs.readFileSync(testFile, 'utf8');
  fs.unlinkSync(testFile);
  console.log('Dateisystemzugriff: ✅ Funktioniert');
} catch (error) {
  console.error('Dateisystemfehler:', error.message);
}

// 4. Versuche, Jest zu importieren
try {
  const jest = require('jest');
  console.log('Jest-Version:', jest.getVersion());
} catch (error) {
  console.error('Jest konnte nicht geladen werden:', error.message);
}

console.log('=== Debug-Informationen abgeschlossen ===');
