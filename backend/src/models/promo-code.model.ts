import pool from '../config/database';

export interface PromoCode {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_value: number;
    max_uses: number | null;
    current_uses: number;
    is_active: boolean;
    valid_from: Date | null;
    valid_until: Date | null;
    created_at: Date;
}

export interface PromoCodeValidation {
    valid: boolean;
    discountValue: number;
    error?: string;
}

class PromoCodeModel {
    /**
     * Find promo code by code string
     */
    async findByCode(code: string): Promise<PromoCode | null> {
        const result = await pool.query(
            'SELECT * FROM promo_codes WHERE UPPER(code) = UPPER($1)',
            [code]
        );
        return result.rows[0] || null;
    }

    /**
     * Validate promo code and return discount value
     */
    async validatePromoCode(code: string, orderTotal: number): Promise<PromoCodeValidation> {
        const promo = await this.findByCode(code);

        // Code not found
        if (!promo) {
            return { valid: false, discountValue: 0, error: 'Promo code not found' };
        }

        // Inactive
        if (!promo.is_active) {
            return { valid: false, discountValue: 0, error: 'Promo code is inactive' };
        }

        // Check date range
        const now = new Date();
        if (promo.valid_from && new Date(promo.valid_from) > now) {
            return { valid: false, discountValue: 0, error: 'Promo code not yet valid' };
        }
        if (promo.valid_until && new Date(promo.valid_until) < now) {
            return { valid: false, discountValue: 0, error: 'Promo code has expired' };
        }

        // Check usage limits
        if (promo.max_uses !== null && promo.current_uses >= promo.max_uses) {
            return { valid: false, discountValue: 0, error: 'Promo code has reached maximum uses' };
        }

        // Check minimum order value
        if (orderTotal < promo.min_order_value) {
            return {
                valid: false,
                discountValue: 0,
                error: `Minimum order value is £${promo.min_order_value.toFixed(2)}`
            };
        }

        // Calculate discount
        let discountValue = 0;
        if (promo.discount_type === 'percentage') {
            discountValue = (orderTotal * promo.discount_value) / 100;
        } else {
            discountValue = promo.discount_value;
        }

        return { valid: true, discountValue };
    }

    /**
     * Increment usage count for promo code
     */
    async incrementUsage(code: string): Promise<void> {
        await pool.query(
            'UPDATE promo_codes SET current_uses = current_uses + 1 WHERE UPPER(code) = UPPER($1)',
            [code]
        );
    }
}

export default new PromoCodeModel();
