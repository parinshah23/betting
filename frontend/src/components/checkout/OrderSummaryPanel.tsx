'use client';

import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

interface OrderSummaryPanelProps {
  cart: Cart;
  walletAmount: number;
}

export function OrderSummaryPanel({ cart, walletAmount }: OrderSummaryPanelProps) {
  const finalTotal = Math.max(0, cart.total - walletAmount);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-100 bg-neutral-50">
        <h2 className="font-semibold text-lg text-neutral-900">Order Summary</h2>
        <p className="text-sm text-neutral-500">{cart.items.reduce((acc, item) => acc + item.quantity, 0)} items</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Items */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                 <Image
                    src={item.competitionImage || '/images/placeholder.jpg'}
                    alt={item.competitionTitle}
                    fill
                    className="object-cover"
                 />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 truncate">{item.competitionTitle}</p>
                <div className="flex justify-between items-center mt-1">
                   <p className="text-sm text-neutral-500">
                     {item.quantity} x {formatCurrency(item.ticketPrice)}
                   </p>
                   <p className="font-medium text-neutral-900">
                     {formatCurrency(item.subtotal)}
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-6 border-t border-neutral-100 space-y-3">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>

          {cart.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-2">
                Discount
                {cart.promoCode && <Badge variant="success" size="sm">{cart.promoCode.code}</Badge>}
              </span>
              <span>-{formatCurrency(cart.discountAmount)}</span>
            </div>
          )}

          {walletAmount > 0 && (
            <div className="flex justify-between text-primary-600 font-medium">
              <span>Wallet Balance Used</span>
              <span>-{formatCurrency(walletAmount)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-neutral-200 flex justify-between items-end">
            <span className="font-bold text-neutral-900 text-lg">To Pay</span>
            <span className="font-bold text-2xl text-neutral-900">{formatCurrency(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
