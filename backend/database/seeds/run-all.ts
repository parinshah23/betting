import pool from '../../src/config/database';
import bcrypt from 'bcryptjs';

async function runSeeds() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🌱 Starting database seeding...');

        // 1. Clear existing data (in reverse dependency order)
        console.log('🧹 Clearing existing seed data...');

        // Check tables exist before deleting
        const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN (
        'winner_claims', 'tickets', 'order_items', 'orders', 
        'cart_items', 'wallets', 'promo_codes', 'competitions', 'users'
      )
    `);
        const existingTables = tableCheck.rows.map(r => r.table_name);

        if (existingTables.includes('winner_claims')) await client.query('DELETE FROM winner_claims');
        if (existingTables.includes('tickets')) await client.query('DELETE FROM tickets');
        if (existingTables.includes('order_items')) await client.query('DELETE FROM order_items');
        if (existingTables.includes('orders')) await client.query('DELETE FROM orders');
        if (existingTables.includes('cart_items')) await client.query('DELETE FROM cart_items');
        if (existingTables.includes('wallets')) await client.query('DELETE FROM wallets');
        if (existingTables.includes('promo_codes')) await client.query('DELETE FROM promo_codes');
        // Only delete test users, not all competitions
        if (existingTables.includes('competitions')) await client.query("DELETE FROM competitions WHERE slug IN ('tesla-model-3', 'iphone-16-pro-max', 'rolex-submariner')");
        if (existingTables.includes('users')) await client.query("DELETE FROM users WHERE email LIKE '%@test.com'");

        // 2. Create test users
        console.log('👥 Creating users...');
        const hashedPassword = await bcrypt.hash('Admin123!', 10);

        const adminResult = await client.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
            ['admin@test.com', hashedPassword, 'Admin', 'User', 'admin', true]
        );
        const adminId = adminResult.rows[0].id;

        const user1Result = await client.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
            ['user1@test.com', hashedPassword, 'John', 'Doe', 'user', true]
        );
        const user1Id = user1Result.rows[0].id;

        const user2Result = await client.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
            ['user2@test.com', hashedPassword, 'Jane', 'Smith', 'user', true]
        );
        const user2Id = user2Result.rows[0].id;

        // 3. Create wallets for users
        console.log('💰 Creating wallets...');
        await client.query('INSERT INTO wallets (user_id, balance) VALUES ($1, 0)', [adminId]);
        await client.query('INSERT INTO wallets (user_id, balance) VALUES ($1, 100)', [user1Id]);
        await client.query('INSERT INTO wallets (user_id, balance) VALUES ($1, 50)', [user2Id]);

        // 4. Create competitions
        console.log('🏆 Creating competitions...');
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Live competition
        const teslaResult = await client.query(
            `INSERT INTO competitions (
        title, slug, description, prize_value, ticket_price, total_tickets,
        end_date, status, skill_question, skill_answer
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
            [
                'Win a Tesla Model 3',
                'tesla-model-3',
                'Win a brand new Tesla Model 3 electric car worth £40,000!',
                40000,
                5.00,
                500,
                sevenDaysFromNow,
                'live',
                'What is 2 + 2?',
                '4'
            ]
        );
        const teslaId = teslaResult.rows[0].id;

        // Add image for Tesla
        await client.query(
            'INSERT INTO competition_images (competition_id, image_url, is_primary) VALUES ($1, $2, $3)',
            [teslaId, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89', true]
        );

        // Ending soon competition
        const iphoneResult = await client.query(
            `INSERT INTO competitions (
        title, slug, description, prize_value, ticket_price, total_tickets,
        end_date, status, skill_question, skill_answer
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
            [
                'iPhone 16 Pro Max',
                'iphone-16-pro-max',
                'Latest iPhone 16 Pro Max 256GB - your choice of color!',
                1200,
                2.50,
                200,
                twoHoursFromNow,
                'live',
                'What is 5 + 5?',
                '10'
            ]
        );
        const iphoneId = iphoneResult.rows[0].id;

        // Add image for iPhone
        await client.query(
            'INSERT INTO competition_images (competition_id, image_url, is_primary) VALUES ($1, $2, $3)',
            [iphoneId, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', true]
        );

        // Completed competition
        const rolexResult = await client.query(
            `INSERT INTO competitions (
        title, slug, description, prize_value, ticket_price, total_tickets,
        end_date, status, skill_question, skill_answer, winning_ticket_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
            [
                'Rolex Submariner',
                'rolex-submariner',
                'Authentic Rolex Submariner watch - timeless luxury!',
                8000,
                10.00,
                100,
                yesterday,
                'ended',
                'What is 10 + 10?',
                '20',
                42
            ]
        );
        const rolexId = rolexResult.rows[0].id;

        // Add image for Rolex
        await client.query(
            'INSERT INTO competition_images (competition_id, image_url, is_primary) VALUES ($1, $2, $3)',
            [rolexId, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49', true]
        );

        // 5. Create promo codes
        console.log('🎟️  Creating promo codes...');

        await client.query(
            `INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, max_uses, current_uses, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            ['WELCOME10', 'percentage', 10, 0, null, 0, true]
        );

        await client.query(
            `INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, max_uses, current_uses, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            ['SAVE20', 'percentage', 20, 50, 100, 0, true]
        );

        await client.query(
            `INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, max_uses, current_uses, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            ['FIRSTBUY', 'percentage', 15, 20, 50, 0, true]
        );

        // Expired code
        await client.query(
            `INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, max_uses, current_uses, is_active, valid_until)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            ['EXPIRED', 'percentage', 25, 0, 100, 0, true, yesterday]
        );

        // Maxed out code
        await client.query(
            `INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, max_uses, current_uses, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            ['MAXED', 'percentage', 30, 0, 10, 10, true]
        );

        // 6. Create orders and tickets for user1
        console.log('🎫 Creating orders and tickets...');

        // Order 1 for user1 - Tesla tickets
        const order1Result = await client.query(
            `INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, stripe_payment_intent_id, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
            [user1Id, 'ORD-20260215-001', 25.00, 'paid', 'stripe', 'pi_test_001', 25.00]
        );
        const order1Id = order1Result.rows[0].id;

        // Create 5 tickets for Tesla
        for (let i = 1; i <= 5; i++) {
            await client.query(
                `INSERT INTO tickets (competition_id, user_id, ticket_number, order_id, status)
         VALUES ($1, $2, $3, $4, $5)`,
                [teslaId, user1Id, i, order1Id, 'sold']
            );
        }

        // Order 2 for user1 - iPhone tickets
        const order2Result = await client.query(
            `INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, stripe_payment_intent_id, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
            [user1Id, 'ORD-20260215-002', 12.50, 'paid', 'stripe', 'pi_test_002', 12.50]
        );
        const order2Id = order2Result.rows[0].id;

        // Create 5 tickets for iPhone
        for (let i = 1; i <= 5; i++) {
            await client.query(
                `INSERT INTO tickets (competition_id, user_id, ticket_number, order_id, status)
         VALUES ($1, $2, $3, $4, $5)`,
                [iphoneId, user1Id, i, order2Id, 'sold']
            );
        }

        // Order 3 for user1 - Rolex winning ticket
        const order3Result = await client.query(
            `INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, stripe_payment_intent_id, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
            [user1Id, 'ORD-20260214-001', 20.00, 'paid', 'stripe', 'pi_test_003', 20.00]
        );
        const order3Id = order3Result.rows[0].id;

        // Create winning ticket for Rolex (ticket #42 matches winning_ticket_number)
        await client.query(
            `INSERT INTO tickets (competition_id, user_id, ticket_number, order_id, status)
       VALUES ($1, $2, $3, $4, $5)`,
            [rolexId, user1Id, 42, order3Id, 'sold']
        );

        // Create 1 more ticket for Rolex
        await client.query(
            `INSERT INTO tickets (competition_id, user_id, ticket_number, order_id, status)
       VALUES ($1, $2, $3, $4, $5)`,
            [rolexId, user1Id, 43, order3Id, 'sold']
        );

        // 7. Create orders for user2
        const order4Result = await client.query(
            `INSERT INTO orders (user_id, order_number, total_amount, status, payment_method, stripe_payment_intent_id, subtotal)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
            [user2Id, 'ORD-20260215-003', 15.00, 'paid', 'stripe', 'pi_test_004', 15.00]
        );
        const order4Id = order4Result.rows[0].id;

        // Create 3 tickets for Tesla
        for (let i = 251; i <= 253; i++) {
            await client.query(
                `INSERT INTO tickets (competition_id, user_id, ticket_number, order_id, status)
         VALUES ($1, $2, $3, $4, $5)`,
                [teslaId, user2Id, i, order4Id, 'sold']
            );
        }

        // 8. Create winner claim for user1
        console.log('🎉 Creating winner claim...');

        // Check if winner_claims table exists
        if (existingTables.includes('winner_claims')) {
            await client.query(
                `INSERT INTO winner_claims (
          competition_id, user_id, ticket_number, claimed, prize_type, delivery_status
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
                [rolexId, user1Id, 42, false, 'physical', 'pending']
            );
        }

        await client.query('COMMIT');
        console.log('✅ Database seeded successfully!');
        console.log('');
        console.log('Test accounts:');
        console.log('  - admin@test.com / Admin123!');
        console.log('  - user1@test.com / Admin123! (has tickets + 1 win)');
        console.log('  - user2@test.com / Admin123! (has tickets)');
        console.log('');
        console.log('Promo codes:');
        console.log('  - WELCOME10 (10% off, active)');
        console.log('  - SAVE20 (20% off, min £50, active)');
        console.log('  - FIRSTBUY (15% off, min £20, active)');
        console.log('  - EXPIRED (expired)');
        console.log('  - MAXED (maxed out)');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Run if called directly
if (require.main === module) {
    runSeeds()
        .then(() => {
            console.log('Done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

export default runSeeds;
