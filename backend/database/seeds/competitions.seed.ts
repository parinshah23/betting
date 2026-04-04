import pool from '../../src/config/database';

async function seedCompetitions() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Seeding Competitions...');

    // 1. Live Competition
    await client.query(`
      INSERT INTO competitions (
        title, slug, description, short_description, prize_value, ticket_price, total_tickets,
        status, end_date, skill_question, skill_answer, featured
      ) VALUES (
        'Win a Tesla Model 3', 'win-tesla-model-3', 
        'Brand new Tesla Model 3 Performance with all the upgrades. 0-60 in 3.1 seconds.', 
        'Win a Tesla Model 3 Performance',
        50000.00, 10.00, 5000,
        'live', NOW() + INTERVAL '7 days',
        'What is 2 + 2?', '4', true
      ) ON CONFLICT (slug) DO NOTHING;
    `);

    // 2. Ending Soon
    await client.query(`
      INSERT INTO competitions (
        title, slug, description, short_description, prize_value, ticket_price, total_tickets,
        status, end_date, skill_question, skill_answer, featured
      ) VALUES (
        'PS5 Bundle', 'win-ps5-bundle', 
        'Sony PlayStation 5 with 2 controllers and 3 games.',
        'Sony PS5 Ultimate Bundle',
        600.00, 2.00, 300,
        'live', NOW() + INTERVAL '2 hours',
        'What is 5 x 5?', '25', false
      ) ON CONFLICT (slug) DO NOTHING;
    `);

    // 3. Win £50 Site Credit — Premium Odds (Rusboy-style)
    await client.query(`
      INSERT INTO competitions (
        title, slug, description, short_description, prize_value, ticket_price, total_tickets,
        status, end_date, skill_question, skill_answer, featured
      ) VALUES (
        '🔥 Win £50 Site Credit — Premium Odds 1:9', 'win-50-site-credit-premium-odds',
        '<p>Win <strong>£50 Site Credit</strong> to spend on any competition on the platform!</p>
<ul>
  <li>Only 9 tickets available — incredible 1 in 9 odds</li>
  <li>Credit is added instantly to your account on winning</li>
  <li>Use credit on any live competition</li>
  <li>Draw takes place once all tickets are sold</li>
</ul>',
        'Win £50 site credit with premium 1:9 odds. Only 9 tickets available!',
        50.00, 1.00, 9,
        'live', NOW() + INTERVAL '14 days',
        'How many tickets are available in this competition?', '9', true
      ) ON CONFLICT (slug) DO NOTHING;
    `);

    // 5. Ended / Sold Out
    await client.query(`
      INSERT INTO competitions (
        title, slug, description, short_description, prize_value, ticket_price, total_tickets,
        status, end_date, skill_question, skill_answer, featured
      ) VALUES (
        'Rolex Submariner', 'win-rolex-submariner', 
        'Luxury watch, never worn. Box and papers included.',
        'Rolex Submariner Date',
        15000.00, 25.00, 600,
        'ended', NOW() - INTERVAL '1 day',
        'What comes after A?', 'B', false
      ) ON CONFLICT (slug) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('Competitions seeded successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error seeding competitions:', e);
  } finally {
    client.release();
    pool.end();
  }
}

seedCompetitions();
