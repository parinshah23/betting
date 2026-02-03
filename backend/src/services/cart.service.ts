/**
 * Cart Service
 * 
 * Manages user shopping carts using PostgreSQL database.
 * Previously used in-memory Map (data was lost on restart).
 */

import { cartModel, Cart, CartItem } from '../models/cart.model';

export { Cart, CartItem };

export const cartService = {
  /**
   * Get or create a cart for a user
   */
  async getCart(userId: string): Promise<Cart> {
    return cartModel.getOrCreateCart(userId);
  },

  /**
   * Add item to cart
   */
  async addItem(userId: string, item: CartItem): Promise<Cart> {
    return cartModel.addItem(userId, item);
  },

  /**
   * Update item quantity in cart
   */
  async updateItem(userId: string, competitionId: string, quantity: number): Promise<Cart> {
    return cartModel.updateItem(userId, competitionId, quantity);
  },

  /**
   * Remove item from cart
   */
  async removeItem(userId: string, competitionId: string): Promise<Cart> {
    return cartModel.removeItem(userId, competitionId);
  },

  /**
   * Clear cart
   */
  async clearCart(userId: string): Promise<void> {
    return cartModel.clearCart(userId);
  },

  /**
   * Apply promo code to cart
   */
  async applyPromoCode(userId: string, promoCode: string, discountPercent: number): Promise<Cart> {
    return cartModel.applyPromoCode(userId, promoCode, discountPercent);
  },

  /**
   * Remove promo code from cart
   */
  async removePromoCode(userId: string): Promise<Cart> {
    return cartModel.removePromoCode(userId);
  },
};
