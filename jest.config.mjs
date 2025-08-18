// Verbesserte Jest-Konfiguration als ES-Modul
const config = {
  // Testumgebung
  testEnvironment: 'node',
  testTimeout: 30000,
  detectOpenHandles: true,
  coverageProvider: 'v8',
  
  // Testdateien finden
  testMatch: [
    '**/__tests__/**/*.test.{js,mjs}',
    '**/?(*.)+(spec|test).{js,mjs}'
  ],
  
  // Zu ignorierende Pfade
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  
  // Module-Transformation
  transform: {},
  transformIgnorePatterns: [
    '/node_modules/',
    '/.next/'
  ],
  
  // Test-Ausführung
  verbose: true,
  
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
