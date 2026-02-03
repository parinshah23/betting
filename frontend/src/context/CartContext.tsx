'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Cart, CartItem } from '@/types';

// Backend cart item interface (snake_case)
interface BackendCartItem {
  competition_id: string;
  quantity: number;
  unit_price: number;
  competition_title: string;
  competition_slug: string;
  competition_image?: string;
}

// Backend cart interface (snake_case)
interface BackendCart {
  user_id: string;
  items: BackendCartItem[];
  promo_code?: string;
  discount_amount: number;
  subtotal: number;
  total: number;
  updated_at: string;
}

// Transform backend cart to frontend format
function transformBackendCart(backendCart: BackendCart): Cart {
  return {
    id: backendCart.user_id,
    items: backendCart.items.map((item): CartItem => ({
      id: item.competition_id,
      competitionId: item.competition_id,
      competitionTitle: item.competition_title,
      competitionSlug: item.competition_slug,
      competitionImage: item.competition_image || '/images/placeholder.jpg',
      ticketPrice: item.unit_price,
      quantity: item.quantity,
      maxQuantity: 100, // Default max, update if needed
      subtotal: item.unit_price * item.quantity,
      competitionEndDate: '', // Not provided by backend
      competitionStatus: 'live', // Default to live since cart only allows live competitions
    })),
    subtotal: backendCart.subtotal,
    discountAmount: backendCart.discount_amount,
    total: backendCart.total,
    promoCode: backendCart.promo_code ? {
      code: backendCart.promo_code,
      discountType: 'percentage',
      discountValue: 0,
      savings: backendCart.discount_amount,
    } : undefined,
  };
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
}

interface CartContextValue extends CartState {
  fetchCart: () => Promise<void>;
  addItem: (competitionId: string, quantity: number, skillAnswer?: string) => Promise<boolean>;
  updateItem: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({
    cart: null,
    isLoading: false,
    error: null,
    itemCount: 0,
  });

  const fetchCart = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await api.get<BackendCart>('/cart');
      if (response.success && response.data) {
        const cart = transformBackendCart(response.data);
        setState({
          cart,
          isLoading: false,
          error: null,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        });
      } else {
        // If cart fetch fails (e.g., not logged in), set empty cart instead of null
        const emptyCart: Cart = {
          id: '',
          items: [],
          subtotal: 0,
          discountAmount: 0,
          total: 0,
        };
        setState({
          cart: emptyCart,
          isLoading: false,
          error: null, // Don't show error for empty cart
          itemCount: 0,
        });
      }
    } catch {
      // On network error, also set empty cart
      const emptyCart: Cart = {
        id: '',
        items: [],
        subtotal: 0,
        discountAmount: 0,
        total: 0,
      };
      setState({
        cart: emptyCart,
        isLoading: false,
        error: null,
        itemCount: 0,
      });
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (
    competitionId: string,
    quantity: number,
    skillAnswer?: string
  ): Promise<boolean> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await api.post<BackendCart>('/cart/add', {
        competition_id: competitionId,
        quantity,
        skill_answer: skillAnswer
      });
      if (response.success && response.data) {
        const cart = transformBackendCart(response.data);
        setState({
          cart,
          isLoading: false,
          error: null,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        });
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || 'Failed to add item',
        }));
        return false;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'An error occurred while adding item',
      }));
      return false;
    }
  };

  const updateItem = async (itemId: string, quantity: number): Promise<boolean> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await api.put<BackendCart>('/cart/update', { competition_id: itemId, quantity });
      if (response.success && response.data) {
        const cart = transformBackendCart(response.data);
        setState({
          cart,
          isLoading: false,
          error: null,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        });
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || 'Failed to update item',
        }));
        return false;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'An error occurred while updating item',
      }));
      return false;
    }
  };

  const removeItem = async (itemId: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await api.delete<BackendCart>(`/cart/${itemId}`);
      if (response.success && response.data) {
        const cart = transformBackendCart(response.data);
        setState({
          cart,
          isLoading: false,
          error: null,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        });
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || 'Failed to remove item',
        }));
        return false;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'An error occurred while removing item',
      }));
      return false;
    }
  };

  const applyPromoCode = async (code: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await api.post<BackendCart>('/cart/apply-promo', { promo_code: code });
      if (response.success && response.data) {
        const cart = transformBackendCart(response.data);
        setState({
          cart,
          isLoading: false,
          error: null,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        });
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || 'Invalid promo code',
        }));
        return false;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'An error occurred while applying promo code',
      }));
      return false;
    }
  };

  const removePromoCode = async () => {
    setState((prev) => ({ ...prev, error: null }));
    try {
      const response = await api.delete<BackendCart>('/cart/promo');
      if (response.success && response.data) {
        const cart = transformBackendCart(response.data);
        setState({
          cart,
          isLoading: false,
          error: null,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        });
      }
    } catch {
      // Ignore errors
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        applyPromoCode,
        removePromoCode,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
