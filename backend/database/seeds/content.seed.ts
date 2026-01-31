import pool from '../../src/config/database';

async function seedContent() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Seeding Content...');

    // FAQ
    await client.query(`
      INSERT INTO content_pages (slug, title, content, is_published)
      VALUES (
        'faq', 'Frequently Asked Questions',
        '# FAQ\n\n**How do I enter?**\nSelect a competition, answer the question, and buy a ticket.\n\n**When is the draw?**\nDraws happen live on Facebook immediately after the competition closes.',
        true
      ) ON CONFLICT (slug) DO NOTHING;
    `);

    // Terms
    await client.query(`
      INSERT INTO content_pages (slug, title, content, is_published)
      VALUES (
        'terms', 'Terms and Conditions',
        '# Terms & Conditions\n\n1. You must be 18+ to enter.\n2. One account per person.\n3. We reserve the right to cancel competitions.',
        true
      ) ON CONFLICT (slug) DO NOTHING;
    `);

    // Privacy
    await client.query(`
      INSERT INTO content_pages (slug, title, content, is_published)
      VALUES (
        'privacy', 'Privacy Policy',
        '# Privacy Policy\n\nWe value your privacy and do not share your data with third parties except for payment processing.',
        true
      ) ON CONFLICT (slug) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('Content seeded successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error seeding content:', e);
  } finally {
    client.release();
    pool.end();
  }
}

seedContent();
