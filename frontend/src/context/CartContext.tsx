'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Cart } from '@/types';

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
      const response = await api.get<Cart>('/cart');
      if (response.success && response.data) {
        setState({
          cart: response.data,
          isLoading: false,
          error: null,
          itemCount: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error?.message || 'Failed to fetch cart',
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'An error occurred while fetching cart',
      }));
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
      const response = await api.post<Cart>('/cart/add', { competitionId, quantity, skillAnswer });
      if (response.success && response.data) {
        setState({
          cart: response.data,
          isLoading: false,
          error: null,
          itemCount: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
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
      const response = await api.put<Cart>('/cart/update', { itemId, quantity });
      if (response.success && response.data) {
        setState({
          cart: response.data,
          isLoading: false,
          error: null,
          itemCount: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
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
      const response = await api.delete<Cart>(`/cart/${itemId}`);
      if (response.success && response.data) {
        setState({
          cart: response.data,
          isLoading: false,
          error: null,
          itemCount: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
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
      const response = await api.post<Cart>('/cart/apply-promo', { code });
      if (response.success && response.data) {
        setState({
          cart: response.data,
          isLoading: false,
          error: null,
          itemCount: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
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
      const response = await api.delete<Cart>('/cart/promo');
      if (response.success && response.data) {
        setState({
          cart: response.data,
          isLoading: false,
          error: null,
          itemCount: response.data.items.reduce((sum, item) => sum + item.quantity, 0),
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
