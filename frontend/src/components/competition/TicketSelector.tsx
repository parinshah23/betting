'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/Input';

interface TicketSelectorProps {
  ticketPrice: number;
  maxQuantity: number;
  onAddToCart: (quantity: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function TicketSelector({
  ticketPrice,
  maxQuantity,
  onAddToCart,
  disabled = false,
  isLoading = false
}: TicketSelectorProps) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity if max changes (e.g. user buys some)
  useEffect(() => {
    if (quantity > maxQuantity && maxQuantity > 0) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity]);

  const handleQuantityChange = (val: number) => {
    // Ensure integer
    const intVal = Math.floor(val);
    if (isNaN(intVal)) return;
    
    // Clamp
    const clamped = Math.max(1, Math.min(intVal, maxQuantity));
    setQuantity(clamped);
  };

  const quickAmounts = [5, 10, 25];

  const totalPrice = ticketPrice * quantity;

  if (maxQuantity === 0) {
    return (
      <div className="p-6 bg-neutral-100 rounded-xl text-center border border-neutral-200">
        <p className="text-neutral-500 font-medium">You have reached the maximum ticket limit for this competition.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
      <div>
        <h3 className="font-semibold text-lg text-neutral-900 mb-4">Select Tickets</h3>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              className="h-12 w-12 p-0 aspect-square"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={disabled || quantity <= 1}
            >
              <Minus className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 sm:w-24">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                className="h-12 text-center text-lg font-bold"
                disabled={disabled}
                min={1}
                max={maxQuantity}
              />
            </div>

            <Button
              variant="outline"
              size="md"
              className="h-12 w-12 p-0 aspect-square"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={disabled || quantity >= maxQuantity}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Select */}
          <div className="flex gap-2 flex-wrap">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                className="h-12 px-4"
                onClick={() => handleQuantityChange(amt)}
                disabled={disabled || amt > maxQuantity}
              >
                +{amt}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              className="h-12 px-4 font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-100"
              onClick={() => handleQuantityChange(maxQuantity)}
              disabled={disabled}
            >
              MAX
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Total Price</p>
          <p className="text-3xl font-bold text-neutral-900">{formatCurrency(totalPrice)}</p>
        </div>

        <Button
          size="lg"
          className="w-full sm:w-auto min-w-[200px] h-14 text-lg shadow-lg shadow-primary-500/20"
          onClick={() => onAddToCart(quantity)}
          disabled={disabled || quantity < 1}
          isLoading={isLoading}
          leftIcon={<ShoppingCart className="w-5 h-5" />}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
