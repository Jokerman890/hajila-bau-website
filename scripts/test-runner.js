// Einfacher Test-Runner für die grundlegende Funktionalität
console.log('Test-Runner gestartet...');

function runTests() {
  console.log('Führe Tests aus...');
  
  // Einfacher Test
  const test1 = 1 + 1 === 2;
  console.log(`Test 1 (1 + 1 = 2): ${test1 ? '✅ Bestanden' : '❌ Fehlgeschlagen'}`);
  
  // Dateisystem-Test
  try {
    const fs = require('fs');
    const path = require('path');
    const testFile = path.join(__dirname, 'test-file.txt');
    
    // Testdatei erstellen
    fs.writeFileSync(testFile, 'Test');
    const fileExists = fs.existsSync(testFile);
    console.log(`Test 2 (Dateisystem): ${fileExists ? '✅ Bestanden' : '❌ Fehlgeschlagen'}`);
    
    // Aufräumen
    if (fileExists) {
      fs.unlinkSync(testFile);
    }
  } catch (error) {
    console.error('Fehler beim Dateisystem-Test:', error.message);
  }
  
  console.log('Tests abgeschlossen');
}

runTests();
