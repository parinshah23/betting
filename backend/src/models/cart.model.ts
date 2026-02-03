/**
 * Cart Model
 * 
 * Database operations for cart persistence.
 * Replaces in-memory Map storage with PostgreSQL.
 */

import pool from '../config/database';

export interface CartItem {
    id?: string;
    cart_id?: string;
    competition_id: string;
    quantity: number;
    unit_price: number;
    competition_title: string;
    competition_slug: string;
    competition_image?: string;
}

export interface Cart {
    id?: string;
    user_id: string;
    items: CartItem[];
    promo_code?: string;
    discount_amount: number;
    subtotal: number;
    total: number;
    created_at?: Date;
    updated_at?: Date;
}

export const cartModel = {
    /**
     * Get or create cart for user
     */
    async getOrCreateCart(userId: string): Promise<Cart> {
        // Try to get existing cart
        const existingCart = await pool.query(
            'SELECT * FROM carts WHERE user_id = $1',
            [userId]
        );

        let cartId: string;

        if (existingCart.rows.length === 0) {
            // Create new cart
            const newCart = await pool.query(
                `INSERT INTO carts (user_id, discount_amount, subtotal, total) 
         VALUES ($1, 0, 0, 0) 
         RETURNING *`,
                [userId]
            );
            cartId = newCart.rows[0].id;
        } else {
            cartId = existingCart.rows[0].id;
        }

        // Get cart with items
        return this.getCartWithItems(cartId);
    },

    /**
     * Get cart with all items
     */
    async getCartWithItems(cartId: string): Promise<Cart> {
        const cartResult = await pool.query(
            'SELECT * FROM carts WHERE id = $1',
            [cartId]
        );

        if (cartResult.rows.length === 0) {
            throw new Error('Cart not found');
        }

        const cart = cartResult.rows[0];

        const itemsResult = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 ORDER BY created_at',
            [cartId]
        );

        return {
            id: cart.id,
            user_id: cart.user_id,
            items: itemsResult.rows,
            promo_code: cart.promo_code,
            discount_amount: parseFloat(cart.discount_amount),
            subtotal: parseFloat(cart.subtotal),
            total: parseFloat(cart.total),
            created_at: cart.created_at,
            updated_at: cart.updated_at,
        };
    },

    /**
     * Get cart by user ID
     */
    async getCartByUserId(userId: string): Promise<Cart | null> {
        const result = await pool.query(
            'SELECT * FROM carts WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return this.getCartWithItems(result.rows[0].id);
    },

    /**
     * Add item to cart
     */
    async addItem(userId: string, item: CartItem): Promise<Cart> {
        const cart = await this.getOrCreateCart(userId);

        // Check if item exists
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND competition_id = $2',
            [cart.id, item.competition_id]
        );

        if (existingItem.rows.length > 0) {
            // Update quantity
            await pool.query(
                `UPDATE cart_items 
         SET quantity = quantity + $1 
         WHERE cart_id = $2 AND competition_id = $3`,
                [item.quantity, cart.id, item.competition_id]
            );
        } else {
            // Insert new item
            await pool.query(
                `INSERT INTO cart_items 
         (cart_id, competition_id, quantity, unit_price, competition_title, competition_slug, competition_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [cart.id, item.competition_id, item.quantity, item.unit_price,
                item.competition_title, item.competition_slug, item.competition_image]
            );
        }

        // Recalculate totals
        await this.recalculateTotals(cart.id!);

        return this.getCartWithItems(cart.id!);
    },

    /**
     * Update item quantity
     */
    async updateItem(userId: string, competitionId: string, quantity: number): Promise<Cart> {
        const cart = await this.getCartByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        if (quantity <= 0) {
            // Remove item
            await pool.query(
                'DELETE FROM cart_items WHERE cart_id = $1 AND competition_id = $2',
                [cart.id, competitionId]
            );
        } else {
            // Update quantity
            const result = await pool.query(
                `UPDATE cart_items 
         SET quantity = $1 
         WHERE cart_id = $2 AND competition_id = $3
         RETURNING *`,
                [quantity, cart.id, competitionId]
            );

            if (result.rows.length === 0) {
                throw new Error('Item not found in cart');
            }
        }

        await this.recalculateTotals(cart.id!);
        return this.getCartWithItems(cart.id!);
    },

    /**
     * Remove item from cart
     */
    async removeItem(userId: string, competitionId: string): Promise<Cart> {
        const cart = await this.getCartByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const result = await pool.query(
            'DELETE FROM cart_items WHERE cart_id = $1 AND competition_id = $2 RETURNING *',
            [cart.id, competitionId]
        );

        if (result.rows.length === 0) {
            throw new Error('Item not found in cart');
        }

        await this.recalculateTotals(cart.id!);
        return this.getCartWithItems(cart.id!);
    },

    /**
     * Clear cart (delete all items but keep cart record)
     */
    async clearCart(userId: string): Promise<void> {
        const cart = await this.getCartByUserId(userId);

        if (cart && cart.id) {
            await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cart.id]);
            await pool.query(
                'UPDATE carts SET subtotal = 0, total = 0, discount_amount = 0, promo_code = NULL WHERE id = $1',
                [cart.id]
            );
        }
    },

    /**
     * Apply promo code
     */
    async applyPromoCode(userId: string, promoCode: string, discountPercent: number): Promise<Cart> {
        const cart = await this.getCartByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        const discountAmount = (cart.subtotal * discountPercent) / 100;
        const total = cart.subtotal - discountAmount;

        await pool.query(
            `UPDATE carts 
       SET promo_code = $1, discount_amount = $2, total = $3 
       WHERE id = $4`,
            [promoCode, discountAmount, total, cart.id]
        );

        return this.getCartWithItems(cart.id!);
    },

    /**
     * Remove promo code
     */
    async removePromoCode(userId: string): Promise<Cart> {
        const cart = await this.getCartByUserId(userId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        await pool.query(
            `UPDATE carts 
       SET promo_code = NULL, discount_amount = 0, total = subtotal 
       WHERE id = $1`,
            [cart.id]
        );

        return this.getCartWithItems(cart.id!);
    },

    /**
     * Recalculate cart totals
     */
    async recalculateTotals(cartId: string): Promise<void> {
        // Calculate subtotal from items
        const result = await pool.query(
            `SELECT COALESCE(SUM(quantity * unit_price), 0) as subtotal 
       FROM cart_items 
       WHERE cart_id = $1`,
            [cartId]
        );

        const subtotal = parseFloat(result.rows[0].subtotal);

        // Get current cart for discount
        const cartResult = await pool.query(
            'SELECT discount_amount, promo_code FROM carts WHERE id = $1',
            [cartId]
        );

        const currentCart = cartResult.rows[0];
        let discountAmount = 0;

        // Recalculate discount if promo code exists
        if (currentCart.promo_code) {
            // For simplicity, keep percent-based discount logic
            // In real app, you'd look up the promo code's discount percent
            discountAmount = parseFloat(currentCart.discount_amount);
        }

        const total = subtotal - discountAmount;

        await pool.query(
            'UPDATE carts SET subtotal = $1, total = $2 WHERE id = $3',
            [subtotal, total, cartId]
        );
    },
};
