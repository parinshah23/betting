'use client';

import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, Lock } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  isCheckoutDisabled?: boolean;
}

export function OrderSummary({ subtotal, discount, total, isCheckoutDisabled = false }: OrderSummaryProps) {
  return (
    <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 space-y-6">
      <h3 className="font-semibold text-lg text-neutral-900">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-neutral-200 flex justify-between items-end">
          <span className="font-bold text-neutral-900 text-base">Total</span>
          <div className="text-right">
            <span className="block font-bold text-2xl text-neutral-900">{formatCurrency(total)}</span>
            <span className="text-xs text-neutral-500">Includes all taxes</span>
          </div>
        </div>
      </div>

      <Button
        href="/checkout"
        size="lg"
        className="w-full"
        rightIcon={<ArrowRight className="w-5 h-5" />}
        disabled={isCheckoutDisabled}
      >
        Proceed to Checkout
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
        <Lock className="w-3 h-3" />
        <span>Secure Checkout</span>
      </div>
    </div>
  );
}
