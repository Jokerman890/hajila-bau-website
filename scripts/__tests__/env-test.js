// Simple test to verify the testing environment
console.log('✅ Environment test script is running');
console.log('Node.js version:', process.version);
console.log('Current working directory:', process.cwd());

// Simple test function
function add(a, b) {
  return a + b;
}

// Test case
const result = add(2, 3);
console.log('2 + 3 =', result);

// Exit with success code
process.exit(0);
