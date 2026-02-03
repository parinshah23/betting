'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Competition } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  Trophy,
  Calendar,
  Ticket,
  Gift,
  Share2,
  Download,
  ArrowRight,
  Search,
  PartyPopper
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import useSWR from 'swr';

interface Win {
  id: string;
  competition: Competition;
  ticketNumber: number;
  prizeValue: number;
  wonAt: string;
  claimed: boolean;
  claimedAt?: string;
  prizeType: 'item' | 'cash' | 'voucher';
  deliveryStatus?: 'pending' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

const fetcher = (url: string) => api.get<{ wins: Win[] }>(url).then(res => {
  if (res.success && res.data) {
    return res.data.wins;
  }
  throw new Error('Failed to fetch wins');
});

export default function MyWinsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: wins, error, isLoading } = useSWR(
    '/api/winners/my-wins',
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  // Filter wins
  const filteredWins = wins?.filter(win =>
    win.competition.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalWins = wins?.length || 0;
  const totalPrizeValue = wins?.reduce((acc, win) => acc + win.prizeValue, 0) || 0;
  const unclaimedWins = wins?.filter(w => !w.claimed).length || 0;

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
        <div className="text-red-600 mb-4">Failed to load your wins</div>
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
            <Trophy className="w-6 h-6 text-yellow-500" />
            My Wins
          </h1>
          <p className="text-gray-500 mt-1">
            Celebrate your victories!
          </p>
        </div>
        <Link
          href="/competitions"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Ticket className="w-4 h-4 mr-2" />
          Enter More Competitions
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-700">Total Wins</p>
              <p className="text-2xl font-bold text-yellow-900">{totalWins}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700">Total Prize Value</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(totalPrizeValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <PartyPopper className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Unclaimed Prizes</p>
              <p className="text-2xl font-bold text-blue-900">{unclaimedWins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your wins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Wins List */}
      {filteredWins && filteredWins.length > 0 ? (
        <div className="grid gap-6">
          {filteredWins.map((win) => (
            <WinCard key={win.id} win={win} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? "No wins match your search" : "No wins yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Keep entering competitions and your wins will appear here!"
            }
          </p>
          {!searchQuery && (
            <Link
              href="/competitions"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse Competitions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

interface WinCardProps {
  win: Win;
}

function WinCard({ win }: WinCardProps) {
  const handleShare = () => {
    // Implementation for sharing win
    if (navigator.share) {
      navigator.share({
        title: `I won ${win.competition.title}!`,
        text: `I just won ${win.competition.title} on the competition platform!`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="relative w-full lg:w-64 h-64 lg:h-auto flex-shrink-0 bg-gray-100">
          {win.competition.images && win.competition.images.length > 0 ? (
            <Image
              src={win.competition.images[0].url}
              alt={win.competition.images[0].altText || win.competition.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy className="w-20 h-20 text-gray-300" />
            </div>
          )}

          {/* Winner Badge */}
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            WINNER
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <Link
                href={`/competitions/${win.competition.slug}`}
                className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
              >
                {win.competition.title}
              </Link>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Won on {formatDate(win.wonAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Ticket className="w-4 h-4" />
                  Winning Ticket #{win.ticketNumber.toString().padStart(6, '0')}
                </span>
              </div>

              {/* Prize Value */}
              <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-lg">
                <Gift className="w-5 h-5" />
                <span className="font-bold text-lg">{formatCurrency(win.prizeValue)}</span>
                <span className="text-sm">Prize Value</span>
              </div>

              {/* Claim Status */}
              {!win.claimed && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <PartyPopper className="w-5 h-5" />
                    <span className="font-semibold">Claim Your Prize!</span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Congratulations! Please claim your prize within 30 days.
                  </p>
                  <Button size="sm" variant="primary">
                    Claim Prize
                  </Button>
                </div>
              )}

              {/* Delivery Status */}
              {win.claimed && win.deliveryStatus && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Delivery Status:</span>
                    <Badge variant={
                      win.deliveryStatus === 'delivered' ? 'success' :
                        win.deliveryStatus === 'shipped' ? 'info' : 'warning'
                    }>
                      {win.deliveryStatus.charAt(0).toUpperCase() + win.deliveryStatus.slice(1)}
                    </Badge>
                  </div>
                  {win.trackingNumber && (
                    <p className="text-sm text-gray-600">
                      Tracking: <span className="font-mono">{win.trackingNumber}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-row lg:flex-col gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Share your win"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {win.claimed && (
                <button
                  className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Download certificate"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
