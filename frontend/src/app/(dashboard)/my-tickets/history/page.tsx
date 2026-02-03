'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Competition, Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  History,
  Ticket as TicketIcon,
  Calendar,
  ArrowRight,
  Search,
  Package,
  Wallet
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import useSWR from 'swr';

interface TicketHistoryItem {
  id: string;
  ticketNumber: number;
  ticketCount: number;
  competition: Competition;
  order: Order;
  purchasedAt: string;
  totalPrice: number;
}

const fetcher = (url: string) => api.get<{ history: TicketHistoryItem[] }>(url).then(res => {
  if (res.success && res.data) {
    return res.data.history;
  }
  throw new Error('Failed to fetch history');
});

export default function TicketHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: history, error, isLoading } = useSWR(
    '/api/tickets/history',
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
    }
  );

  // Filter history
  const filteredHistory = history?.filter(item =>
    item.competition.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by date
  const groupedByDate = filteredHistory?.reduce((acc, item) => {
    const date = new Date(item.purchasedAt).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, TicketHistoryItem[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load ticket history</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-6 h-6" />
            Ticket History
          </h1>
          <p className="text-gray-500 mt-1">
            View all your past ticket purchases
          </p>
        </div>
        <Link
          href="/my-tickets"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <TicketIcon className="w-4 h-4 mr-2" />
          Back to Active Tickets
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* History List */}
      {groupedByDate && Object.keys(groupedByDate).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedByDate).map(([date, items]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {date}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <HistoryItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No history found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "No purchases match your search"
              : "You haven't purchased any tickets yet"
            }
          </p>
          <Link
            href="/competitions"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse Competitions
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}

interface HistoryItemCardProps {
  item: TicketHistoryItem;
}

function HistoryItemCard({ item }: HistoryItemCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/competitions/${item.competition.slug}`}
                className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
              >
                {item.competition.title}
              </Link>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Order #{item.order.orderNumber}
                </span>
                <span className="flex items-center gap-1">
                  <TicketIcon className="w-4 h-4" />
                  {item.ticketCount} ticket{item.ticketCount > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Wallet className="w-4 h-4" />
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            </div>
            <Badge
              variant={item.order.status === 'paid' ? 'success' :
                item.order.status === 'refunded' ? 'info' : 'default'}
            >
              {item.order.status.charAt(0).toUpperCase() + item.order.status.slice(1)}
            </Badge>
          </div>

          {/* Ticket Numbers */}
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: Math.min(item.ticketCount, 5) }).map((_, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-mono"
              >
                #{(item.ticketNumber + i).toString().padStart(6, '0')}
              </span>
            ))}
            {item.ticketCount > 5 && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{item.ticketCount - 5} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          <Link
            href={`/competitions/${item.competition.slug}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Competition
          </Link>
        </div>
      </div>
    </div>
  );
}
