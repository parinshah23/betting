const bcrypt = require('bcryptjs');

// Test if bcrypt is working
async function testBcrypt() {
  const password = 'password123';
  
  // The hash from the database
  const hashFromDB = '$2b$10$EpOdNfQZq.p.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x';
  
  console.log('Testing bcrypt comparison...');
  console.log('Password:', password);
  console.log('Hash from DB:', hashFromDB);
  
  try {
    const isValid = await bcrypt.compare(password, hashFromDB);
    console.log('Password match:', isValid);
    
    // Generate a new hash to see what it should look like
    const newHash = await bcrypt.hash(password, 10);
    console.log('New generated hash:', newHash);
    
    const isValidNew = await bcrypt.compare(password, newHash);
    console.log('New hash match:', isValidNew);
  } catch (error) {
    console.error('Bcrypt error:', error);
  }
}

testBcrypt();
