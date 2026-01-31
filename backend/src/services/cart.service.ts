/**
 * Cart Service
 * 
 * Manages user shopping carts. In production, this should use Redis.
 * For now, we use an in-memory Map (data is lost on server restart).
 */

export interface CartItem {
  competition_id: string;
  quantity: number;
  unit_price: number;
  competition_title: string;
  competition_slug: string;
  competition_image?: string;
}

export interface Cart {
  user_id: string;
  items: CartItem[];
  promo_code?: string;
  discount_amount: number;
  subtotal: number;
  total: number;
  updated_at: Date;
}

// In-memory cart storage (use Redis in production)
const carts = new Map<string, Cart>();

export const cartService = {
  /**
   * Get or create a cart for a user
   */
  getCart(userId: string): Cart {
    if (!carts.has(userId)) {
      carts.set(userId, {
        user_id: userId,
        items: [],
        discount_amount: 0,
        subtotal: 0,
        total: 0,
        updated_at: new Date(),
      });
    }
    return carts.get(userId)!;
  },

  /**
   * Add item to cart
   */
  addItem(userId: string, item: CartItem): Cart {
    const cart = this.getCart(userId);
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      i => i.competition_id === item.competition_id
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.items.push(item);
    }

    this.recalculateCart(cart);
    return cart;
  },

  /**
   * Update item quantity in cart
   */
  updateItem(userId: string, competitionId: string, quantity: number): Cart {
    const cart = this.getCart(userId);
    
    const itemIndex = cart.items.findIndex(
      i => i.competition_id === competitionId
    );

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    this.recalculateCart(cart);
    return cart;
  },

  /**
   * Remove item from cart
   */
  removeItem(userId: string, competitionId: string): Cart {
    const cart = this.getCart(userId);
    
    const itemIndex = cart.items.findIndex(
      i => i.competition_id === competitionId
    );

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    cart.items.splice(itemIndex, 1);
    this.recalculateCart(cart);
    return cart;
  },

  /**
   * Clear cart
   */
  clearCart(userId: string): void {
    carts.delete(userId);
  },

  /**
   * Apply promo code to cart
   */
  applyPromoCode(userId: string, promoCode: string, discountPercent: number): Cart {
    const cart = this.getCart(userId);
    
    cart.promo_code = promoCode;
    cart.discount_amount = (cart.subtotal * discountPercent) / 100;
    cart.total = cart.subtotal - cart.discount_amount;
    cart.updated_at = new Date();

    return cart;
  },

  /**
   * Remove promo code from cart
   */
  removePromoCode(userId: string): Cart {
    const cart = this.getCart(userId);
    
    cart.promo_code = undefined;
    cart.discount_amount = 0;
    cart.total = cart.subtotal;
    cart.updated_at = new Date();

    return cart;
  },

  /**
   * Recalculate cart totals
   */
  recalculateCart(cart: Cart): void {
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    
    cart.total = cart.subtotal - cart.discount_amount;
    cart.updated_at = new Date();
  },
};
