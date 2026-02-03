'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { CartItem } from '@/components/cart/CartItem';
import { PromoCodeSection } from '@/components/cart/PromoCodeSection';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem, applyPromoCode, removePromoCode } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const handleUpdateQuantity = async (itemId: string, qty: number) => {
    setUpdatingItemId(itemId);
    await updateItem(itemId, qty);
    setUpdatingItemId(null);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      setUpdatingItemId(itemId);
      await removeItem(itemId);
      setUpdatingItemId(null);
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Empty Cart State
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center max-w-md">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your Cart is Empty</h1>
        <p className="text-neutral-500 mb-8">
          Looks like you haven&apos;t added any tickets yet.
          Check out our live competitions to find your next win!
        </p>
        <Button href="/competitions" size="lg" className="w-full sm:w-auto">
          Browse Competitions
        </Button>
      </div>
    );
  }

  const hasInvalidItems = cart.items.some(item => item.competitionStatus && item.competitionStatus !== 'live');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
        Your Cart
        <span className="text-lg font-normal text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
          {cart.items.reduce((acc, item) => acc + item.quantity, 0)} items
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
                onRemove={() => handleRemoveItem(item.id)}
                isUpdating={updatingItemId === item.id}
              />
            ))}
          </div>

          <Link
            href="/competitions"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4 space-y-6">
          <PromoCodeSection
            appliedCode={cart.promoCode}
            onApply={applyPromoCode}
            onRemove={removePromoCode}
          />

          <OrderSummary
            subtotal={cart.subtotal}
            discount={cart.discountAmount}
            total={cart.total}
            isCheckoutDisabled={hasInvalidItems}
          />
        </div>
      </div>
    </div>
  );
}
