import pool from '../../src/config/database';
import bcrypt from 'bcryptjs';

async function seedUsers() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Seeding Users...');

    // Generate real password hash
    const PASSWORD_HASH = bcrypt.hashSync('password123', 10);
    console.log('Generated password hash:', PASSWORD_HASH);

    // Admin User
    await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
      VALUES ($1, $2, 'Admin', 'User', 'admin', true)
      ON CONFLICT (email) DO UPDATE SET password_hash = $2
    `, ['admin@example.com', PASSWORD_HASH]);

    // Test User
    await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
      VALUES ($1, $2, 'Test', 'User', 'user', true)
      ON CONFLICT (email) DO UPDATE SET password_hash = $2
    `, ['user@example.com', PASSWORD_HASH]);

    await client.query('COMMIT');
    console.log('Users seeded successfully');
    console.log('You can login with:');
    console.log('  Email: admin@example.com, Password: password123');
    console.log('  Email: user@example.com, Password: password123');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error seeding users:', e);
  } finally {
    client.release();
    pool.end();
  }
}

seedUsers();
