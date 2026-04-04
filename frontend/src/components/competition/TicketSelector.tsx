'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Shuffle, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';

interface Ticket {
  id: string;
  ticket_number: number;
  status: 'available' | 'sold' | 'reserved';
}

interface TicketSelectorProps {
  competitionId: string;
  ticketPrice: number;
  maxQuantity: number;
  onAddToCart: (quantity: number, ticketNumbers: number[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function TicketSelector({
  competitionId,
  ticketPrice,
  maxQuantity,
  onAddToCart,
  disabled = false,
  isLoading = false,
}: TicketSelectorProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [fetching, setFetching] = useState(true);

  const fetchTickets = useCallback(async () => {
    setFetching(true);
    try {
      const res = await api.get<{
        total_tickets: number;
        available_tickets: number;
        tickets: Ticket[];
      }>(`/competitions/${competitionId}/tickets`);
      if (res.success && res.data) {
        setTickets(res.data.tickets);
      }
    } catch {
      // silently fail — grid just won't show
    } finally {
      setFetching(false);
    }
  }, [competitionId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const availableNumbers = new Set(
    tickets.filter((t) => t.status === 'available').map((t) => t.ticket_number)
  );

  const toggle = (num: number) => {
    if (disabled) return;
    if (!availableNumbers.has(num)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        if (next.size >= maxQuantity) return prev;
        next.add(num);
      }
      return next;
    });
  };

  const pickRandom = (count: number) => {
    const pool = Array.from(availableNumbers).filter((n) => !selected.has(n));
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, Math.min(count, maxQuantity - selected.size));
    setSelected((prev) => new Set(Array.from(prev).concat(picks)));
  };

  const clearAll = () => setSelected(new Set());

  const totalPrice = ticketPrice * selected.size;

  // The API now returns the full range already
  const allNumbers = tickets.map((t) => t.ticket_number).sort((a, b) => a - b);

  if (maxQuantity === 0) {
    return (
      <div className="p-6 bg-white/5 rounded-xl text-center border border-white/10">
        <p className="text-white/50 font-medium">You have reached the maximum ticket limit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-white">Pick Your Lucky Numbers</h3>
        <span className="text-sm text-white/40">
          {selected.size} / {maxQuantity} selected
        </span>
      </div>

      {/* Quick Pick Row */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-white/40 self-center mr-1">Quick pick:</span>
        {[1, 5, 10, 25].map((n) => (
          <button
            key={n}
            onClick={() => pickRandom(n)}
            disabled={disabled || selected.size >= maxQuantity}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
              border border-[#0160C9]/40 text-[#3ACBE8] bg-[#0160C9]/10
              hover:bg-[#0160C9]/25 hover:border-[#1CA3DE]/60
              disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Shuffle className="w-3 h-3" />+{n}
          </button>
        ))}
        {selected.size > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
              border border-red-500/30 text-red-400 bg-red-500/10
              hover:bg-red-500/20 transition-all"
          >
            <X className="w-3 h-3" />Clear
          </button>
        )}
      </div>

      {/* Ticket Grid */}
      {fetching ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-2 border-[#0D85D8] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 max-h-72 overflow-y-auto">
          {/* Legend */}
          <div className="flex gap-4 mb-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <div className="w-3 h-3 rounded bg-[#0041C7]/40 border border-[#0160C9]/40" />
              Available
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <div className="w-3 h-3 rounded bg-[#3ACBE8]/30 border border-[#3ACBE8]" />
              Selected
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
              Sold
            </div>
          </div>

          <div className="grid gap-1.5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}
          >
            {allNumbers.map((num) => {
              const isAvailable = availableNumbers.has(num);
              const isSelected = selected.has(num);

              return (
                <button
                  key={num}
                  onClick={() => toggle(num)}
                  disabled={disabled || (!isAvailable && !isSelected)}
                  className={[
                    'h-10 rounded-lg text-xs font-bold transition-all duration-150 select-none',
                    isSelected
                      ? 'bg-[#3ACBE8]/20 border-2 border-[#3ACBE8] text-[#3ACBE8] shadow-[0_0_8px_rgba(58,203,232,0.4)] scale-105'
                      : isAvailable
                      ? 'bg-[#0041C7]/20 border border-[#0160C9]/50 text-white/80 hover:bg-[#0160C9]/30 hover:border-[#1CA3DE]/70 hover:text-white cursor-pointer'
                      : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed',
                  ].join(' ')}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected numbers chips */}
      {selected.size > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Array.from(selected)
            .sort((a, b) => a - b)
            .map((num) => (
              <span
                key={num}
                onClick={() => toggle(num)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold
                  bg-[#3ACBE8]/15 border border-[#3ACBE8]/50 text-[#3ACBE8] cursor-pointer
                  hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-400 transition-all"
              >
                #{num} <X className="w-2.5 h-2.5" />
              </span>
            ))}
        </div>
      )}

      {/* Summary & CTA */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wide">Total</p>
          <p className="text-3xl font-black text-white">
            {formatCurrency(totalPrice)}
          </p>
          {selected.size > 0 && (
            <p className="text-xs text-white/40 mt-0.5">
              {selected.size} ticket{selected.size !== 1 ? 's' : ''} × {formatCurrency(ticketPrice)}
            </p>
          )}
        </div>

        <Button
          size="lg"
          className="w-full sm:w-auto min-w-[200px] h-14 text-base font-bold
            bg-gradient-to-r from-[#0D85D8] to-[#0041C7]
            hover:from-[#1CA3DE] hover:to-[#0160C9]
            shadow-[0_0_20px_rgba(13,133,216,0.4)] hover:shadow-[0_0_30px_rgba(28,163,222,0.5)]
            border-0 transition-all duration-300"
          onClick={() => onAddToCart(selected.size, Array.from(selected))}
          disabled={disabled || selected.size === 0}
          isLoading={isLoading}
          leftIcon={<ShoppingCart className="w-5 h-5" />}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
