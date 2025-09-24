// Jest setup file
import '@testing-library/jest-dom'

// Mock crypto.randomUUID for Node.js environments
if (!global.crypto) {
  global.crypto = {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
  }
}

// Mock File constructor for tests
if (typeof File === 'undefined') {
  global.File = class File {
    constructor(chunks, filename, options = {}) {
      this.name = filename
      this.type = options.type || ''
      this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
      this.lastModified = Date.now()
    }
  }
}
