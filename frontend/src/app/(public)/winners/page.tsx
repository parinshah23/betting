'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Competition } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  Trophy,
  Ticket,
  Users,
  Gift,
  Share2,
  ArrowRight,
  Search,
  Sparkles
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import useSWR from 'swr';

interface Winner {
  id: string;
  competition: Competition;
  displayName: string;
  ticketNumber: number;
  avatar?: string;
  wonAt: string;
  prizeValue: number;
}

interface WinnersData {
  winners: Winner[];
  totalWinners: number;
  totalPrizeValue: number;
  thisMonthWinners: number;
}

const fetcher = (url: string) => api.get<WinnersData>(url).then(res => {
  if (res.success && res.data) {
    return res.data;
  }
  throw new Error('Failed to fetch winners');
});

export default function WinnersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: winnersData, error, isLoading } = useSWR(
    '/winners/gallery',
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  // Filter winners
  const filteredWinners = winnersData?.winners.filter(winner =>
    winner.competition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    winner.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Failed to load winners gallery</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white py-16 md:py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 px-4 py-2 rounded-full mb-6">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">Celebrating Our Winners</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Winners </span>
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Gallery</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Meet our lucky winners and see what amazing prizes have been won!
            </p>

            {/* Stats with premium styling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400 text-sm">Total Winners</span>
                </div>
                <p className="text-3xl font-bold text-white">{winnersData?.totalWinners || 0}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-accent-400" />
                  <span className="text-gray-400 text-sm">Prizes Awarded</span>
                </div>
                <p className="text-3xl font-bold text-white">{formatCurrency(winnersData?.totalPrizeValue || 0)}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-400 text-sm">This Month</span>
                </div>
                <p className="text-3xl font-bold text-white">{winnersData?.thisMonthWinners || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search winners or competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Winners Grid */}
        {filteredWinners && filteredWinners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No winners match your search" : "No winners yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Be the first winner! Enter our competitions today."
              }
            </p>
            {!searchQuery && (
              <Link
                href="/competitions"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Browse Competitions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        )}

        {/* Premium CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Could You Be Our <span className="text-accent-600">Next Winner?</span>
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of players and get your chance to win amazing prizes.
            New competitions added weekly!
          </p>
          <Link
            href="/competitions"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-semibold text-lg shadow-xl shadow-accent-500/25 hover:shadow-accent-500/40 transition-all hover:scale-105"
          >
            Enter Competition
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface WinnerCardProps {
  winner: Winner;
}

function WinnerCard({ winner }: WinnerCardProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${winner.displayName} won ${winner.competition.title}!`,
        text: `Congratulations to ${winner.displayName} for winning ${winner.competition.title}!`,
        url: window.location.href,
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {winner.competition.images && winner.competition.images.length > 0 ? (
          <Image
            src={winner.competition.images[0].url}
            alt={winner.competition.images[0].altText || winner.competition.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gift className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Winner Badge */}
        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
          <Trophy className="w-4 h-4" />
          WINNER
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-white transition-all shadow-md"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Winner Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            {winner.avatar ? (
              <Image
                src={winner.avatar}
                alt={winner.displayName}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <span className="text-xl font-bold text-primary-600">
                {winner.displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{winner.displayName}</p>
            <p className="text-sm text-gray-500">
              Won {formatDate(winner.wonAt)}
            </p>
          </div>
        </div>

        {/* Competition Info */}
        <Link
          href={`/competitions/${winner.competition.slug}`}
          className="block font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2"
        >
          {winner.competition.title}
        </Link>

        {/* Prize Value */}
        <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
          <Gift className="w-4 h-4" />
          {formatCurrency(winner.prizeValue)} Prize
        </div>

        {/* Ticket Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Ticket className="w-4 h-4" />
            Winning Ticket #{winner.ticketNumber.toString().padStart(6, '0')}
          </span>
          <Badge variant="success" size="sm">Verified</Badge>
        </div>
      </div>
    </Card>
  );
}
