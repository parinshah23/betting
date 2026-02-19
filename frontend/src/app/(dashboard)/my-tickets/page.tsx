'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Ticket, Competition } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import {
  Ticket as TicketIcon,
  Calendar,
  Trophy,
  ArrowRight,
  Search,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import useSWR from 'swr';

// Backend returns snake_case fields, we need to map to camelCase
interface BackendTicket {
  id: string;
  competition_id: string;
  user_id: string;
  ticket_number: number;
  is_instant_win: boolean;
  instant_win_prize?: string;
  purchased_at: string;
  competition: {
    id: string;
    title: string;
    slug: string;
    prize_value?: number;
    status: 'draft' | 'live' | 'ended' | 'completed' | 'cancelled';
    draw_date?: string | null;
  };
}

interface TicketWithCompetition extends Ticket {
  competition: Competition;
}

const fetcher = (url: string) => api.get<BackendTicket[]>(url).then(res => {
  if (res.success && res.data) {
    // Map snake_case to camelCase
    return res.data.map((ticket): TicketWithCompetition => ({
      id: ticket.id,
      competitionId: ticket.competition_id,
      userId: ticket.user_id,
      ticketNumber: ticket.ticket_number,
      isInstantWin: ticket.is_instant_win,
      instantWinPrize: ticket.instant_win_prize,
      purchasedAt: ticket.purchased_at,
      competition: {
        id: ticket.competition.id,
        title: ticket.competition.title,
        slug: ticket.competition.slug,
        description: '',
        prize_value: ticket.competition.prize_value,
        status: ticket.competition.status,
        draw_date: ticket.competition.draw_date,
      } as Competition,
    }));
  }
  throw new Error('Failed to fetch tickets');
});

export default function MyTicketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');

  const { data: tickets, error, isLoading } = useSWR(
    '/tickets/my-tickets',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Filter tickets
  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = ticket.competition.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && ['live', 'draft'].includes(ticket.competition.status);
    if (filter === 'ended') return matchesSearch && ['ended', 'completed', 'cancelled'].includes(ticket.competition.status);

    return matchesSearch;
  });

  // Separate active and ended tickets
  const activeTickets = filteredTickets?.filter(t => ['live', 'draft'].includes(t.competition.status)) || [];
  const endedTickets = filteredTickets?.filter(t => ['ended', 'completed', 'cancelled'].includes(t.competition.status)) || [];

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
        <div className="text-red-600 mb-4">Failed to load tickets</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-500 mt-1">
            You have <span className="font-semibold text-primary-600">{activeTickets.length}</span> active tickets
          </p>
        </div>
        <Link
          href="/competitions"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <TicketIcon className="w-4 h-4 mr-2" />
          Buy More Tickets
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'active'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('ended')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'ended'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Ended
            </button>
          </div>
        </div>
      </div>

      {/* Active Tickets Section */}
      {(filter === 'all' || filter === 'active') && activeTickets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Badge variant="success">Live</Badge>
            Active Competitions
          </h2>
          <div className="grid gap-4">
            {activeTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </div>
      )}

      {/* Ended Tickets Section */}
      {(filter === 'all' || filter === 'ended') && endedTickets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Badge variant="default">Completed</Badge>
            Past Competitions
          </h2>
          <div className="grid gap-4">
            {endedTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} showWinner />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTickets?.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "No tickets match your search criteria"
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

interface TicketCardProps {
  ticket: TicketWithCompetition;
  showWinner?: boolean;
}

function TicketCard({ ticket, showWinner = false }: TicketCardProps) {
  const isActive = ['live', 'draft'].includes(ticket.competition.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 bg-gray-100">
          {ticket.competition.images && ticket.competition.images.length > 0 ? (
            <Image
              src={ticket.competition.images[0].url}
              alt={ticket.competition.images[0].altText || ticket.competition.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-gray-300" />
            </div>
          )}
          {ticket.isInstantWin && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
              Instant Win
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <Link
                href={`/competitions/${ticket.competition.slug}`}
                className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
              >
                {ticket.competition.title}
              </Link>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <TicketIcon className="w-4 h-4" />
                  Ticket #{ticket.ticketNumber?.toString().padStart(6, '0') || '---'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Purchased {formatDistanceToNow(ticket.purchasedAt)}
                </span>
              </div>

              {ticket.isInstantWin && ticket.instantWinPrize && (
                <div className="mt-2 inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  <Trophy className="w-4 h-4" />
                  Won: {ticket.instantWinPrize}
                </div>
              )}
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              {isActive ? (
                <>
                  <Badge variant="success">Active</Badge>
                  {ticket.competition.endDate && (
                    <div className="text-sm text-gray-600">
                      Ends in <CountdownTimer endDate={ticket.competition.endDate} />
                    </div>
                  )}
                </>
              ) : (
                <Badge variant={ticket.competition.status === 'completed' ? 'info' : 'default'}>
                  {ticket.competition.status === 'completed' ? 'Completed' : 'Ended'}
                </Badge>
              )}
            </div>
          </div>

          {/* Winner Info */}
          {showWinner && ticket.competition.winner && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">
                  Winner: {ticket.competition.winner.displayName || 'Anonymous'}
                </span>
              </div>
              {ticket.competition.winner.ticketNumber === ticket.ticketNumber && (
                <div className="mt-2 text-green-700 font-medium">
                  🎉 Congratulations! You won this competition!
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            <Link
              href={`/competitions/${ticket.competition.slug}`}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Competition
            </Link>
            {isActive && (
              <Link
                href={`/competitions/${ticket.competition.slug}?buy=true`}
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <TicketIcon className="w-4 h-4 mr-1" />
                Buy More
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
