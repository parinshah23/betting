'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
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
  Trophy
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import useSWR from 'swr';

// New order-grouped interface matching backend response
interface TicketHistoryOrder {
  orderNumber: string;
  totalPrice: number;
  purchaseDate: string;
  tickets: Array<{
    competition: {
      id: string;
      title: string;
      slug: string;
      image: string;
    };
    ticketNumber: number;
    isWinner: boolean;
  }>;
}

interface TicketHistoryResponse {
  orders: TicketHistoryOrder[];
}

const fetcher = (url: string) => api.get<TicketHistoryResponse>(url).then(res => {
  if (res.success && res.data) {
    return res.data.orders || [];
  }
  throw new Error('Failed to fetch history');
});

export default function TicketHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: orders, error, isLoading } = useSWR(
    '/tickets/history',
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  // Filter orders by competition title
  const filteredOrders = orders?.filter(order =>
    order.tickets.some(ticket =>
      ticket.competition.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Stats
  const totalOrders = orders?.length || 0;
  const totalTickets = orders?.reduce((acc, order) => acc + order.tickets.length, 0) || 0;
  const totalSpent = orders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;

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

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-sm text-gray-500">Orders</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
          <p className="text-sm text-gray-500">Tickets</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalSpent)}</p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
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

      {/* History List - Grouped by Order */}
      {filteredOrders && filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.orderNumber} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-5 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.purchaseDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">Paid</Badge>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-primary-600">
                      {formatCurrency(order.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tickets in this order */}
              <div className="divide-y divide-gray-100">
                {order.tickets.map((ticket, idx) => (
                  <div
                    key={`${order.orderNumber}-${ticket.ticketNumber}-${idx}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Competition Image */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {ticket.competition.image ? (
                        <Image
                          src={ticket.competition.image}
                          alt={ticket.competition.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TicketIcon className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Ticket Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/competitions/${ticket.competition.slug}`}
                        className="font-medium text-gray-900 hover:text-primary-600 transition-colors truncate block"
                      >
                        {ticket.competition.title}
                      </Link>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <TicketIcon className="w-3.5 h-3.5" />
                        Ticket #{ticket.ticketNumber.toString().padStart(6, '0')}
                      </p>
                    </div>

                    {/* Winner Badge */}
                    {ticket.isWinner && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        <Trophy className="w-3.5 h-3.5" />
                        Winner! 🎉
                      </span>
                    )}
                  </div>
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
