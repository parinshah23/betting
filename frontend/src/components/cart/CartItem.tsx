'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, isUpdating = false }: CartItemProps) {
  const isIssue = item.competitionStatus && item.competitionStatus !== 'live';

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > item.maxQuantity) return;
    onUpdateQuantity(newQty);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      )}

      {/* Image */}
      <Link href={`/competitions/${item.competitionSlug}`} className="shrink-0 relative w-full sm:w-24 aspect-square rounded-lg overflow-hidden bg-neutral-100">
        <Image
          src={item.competitionImage || '/images/placeholder.jpg'}
          alt={item.competitionTitle}
          fill
          className="object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link href={`/competitions/${item.competitionSlug}`} className="font-semibold text-neutral-900 hover:text-primary-600 line-clamp-2">
              {item.competitionTitle}
            </Link>
            <button
              onClick={onRemove}
              className="text-neutral-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            {formatCurrency(item.ticketPrice)} per ticket
          </p>
        </div>

        {/* Status Warning */}
        {isIssue && (
          <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Competition is {item.competitionStatus?.replace('_', ' ') || 'unavailable'}. Please remove.
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating || isIssue}
            >
              <Minus className="w-3 h-3" />
            </Button>

            <span className="w-8 text-center font-medium text-neutral-900">{item.quantity}</span>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity || isUpdating || isIssue}
            >
              <Plus className="w-3 h-3" />
            </Button>

            <span className="text-xs text-neutral-400 ml-2">
              Max: {item.maxQuantity}
            </span>
          </div>

          {/* Subtotal */}
          <div className="text-right font-bold text-neutral-900">
            {formatCurrency(item.subtotal)}
          </div>
        </div>
      </div>
    </div>
  );
}
