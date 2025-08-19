#!/bin/bash
echo "Starte Testumgebung..."
node -v
npm -v
echo "Führe einfachen Test aus..."
node -e "console.log('Node.js funktioniert:', process.version)"
echo "Test abgeschlossen."
