import pool from '../config/database';

export interface Winner {
    id: string;
    competition_id: string;
    user_id: string;
    ticket_number: number;
    claimed: boolean;
    claim_date: Date | null;
    prize_type: 'physical' | 'cash' | 'voucher' | null;
    delivery_status: 'pending' | 'processing' | 'shipped' | 'delivered';
    tracking_number: string | null;
    claim_address: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface ClaimInput {
    prize_type: 'physical' | 'cash' | 'voucher';
    claim_address?: string;
}

class WinnerModel {
    /**
     * Find all wins for a specific user
     */
    async findByUser(userId: string): Promise<Winner[]> {
        const result = await pool.query(
            `SELECT
        wc.*,
        c.title as competition_title,
        c.slug as competition_slug,
        c.prize_value,
        (SELECT ci.image_url FROM competition_images ci WHERE ci.competition_id = c.id AND ci.is_primary = true LIMIT 1) as competition_image
      FROM winner_claims wc
      JOIN competitions c ON wc.competition_id = c.id
      WHERE wc.user_id = $1
      ORDER BY wc.created_at DESC`,
            [userId]
        );
        return result.rows;
    }

    /**
     * Find winner by competition and user
     */
    async findByCompetitionAndUser(competitionId: string, userId: string): Promise<Winner | null> {
        const result = await pool.query(
            'SELECT * FROM winner_claims WHERE competition_id = $1 AND user_id = $2',
            [competitionId, userId]
        );
        return result.rows[0] || null;
    }

    /**
     * Claim a prize
     */
    async claimPrize(
        competitionId: string,
        userId: string,
        claimData: ClaimInput
    ): Promise<Winner> {
        const { prize_type, claim_address } = claimData;

        // Validate physical prize has address
        if (prize_type === 'physical' && !claim_address) {
            throw new Error('Delivery address is required for physical prizes');
        }

        // Update existing winner record
        const result = await pool.query(
            `UPDATE winner_claims
             SET
                claimed = true,
                claim_date = CURRENT_TIMESTAMP,
                prize_type = $3,
                claim_address = $4,
                delivery_status = 'pending'
             WHERE competition_id = $1 AND user_id = $2
             RETURNING *`,
            [competitionId, userId, prize_type, claim_address || null]
        );

        if (result.rows.length === 0) {
            throw new Error('No winning ticket found for this user');
        }

        return result.rows[0];
    }

    /**
     * Update delivery status
     */
    async updateDeliveryStatus(
        competitionId: string,
        userId: string,
        status: 'pending' | 'processing' | 'shipped' | 'delivered',
        trackingNumber?: string
    ): Promise<void> {
        await pool.query(
            `UPDATE winner_claims
       SET delivery_status = $3, tracking_number = $4
       WHERE competition_id = $1 AND user_id = $2`,
            [competitionId, userId, status, trackingNumber || null]
        );
    }
}

export default new WinnerModel();
