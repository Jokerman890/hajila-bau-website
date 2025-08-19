// Verbesserte Jest-Konfiguration als ES-Modul
const isCI = process.env.CI === 'true';

module.exports = {
  // Testumgebung
  testEnvironment: 'node',
  testTimeout: 30000, // 30 Sekunden Timeout für alle Tests
  detectOpenHandles: true,
  forceExit: true, // Beendet den Prozess nach Testende
  
  // Testdateien finden
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Zu ignorierende Pfade
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/.github/'
  ],
  
  // Keine Transformation für einfache JS-Tests
  transform: {},
  transformIgnorePatterns: [],
  
  // Test-Ausführung
  verbose: true,
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  
  // Coverage
  collectCoverage: false, // Deaktiviert vorerst für schnellere Tests
  
  // Coverage-Berichte
  collectCoverage: true,
  collectCoverageFrom: [
    'scripts/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/coverage/**',
    '!**/.next/**',
    '!**/jest.config.*',
    '!**/next.config.*'
  ],
  
  // Module-Darstellung
  moduleFileExtensions: ['js', 'mjs', 'json', 'node']
};

export default config;
