'use client';

import React from 'react';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ActiveCompetitions, ActiveCompetition } from '@/components/dashboard/ActiveCompetitions';
import { RecentActivity, ActivityItem } from '@/components/dashboard/RecentActivity';
import { Spinner } from '@/components/ui/Spinner';
import type { WalletTransaction } from '@/types';

// Backend response types
interface BackendWallet {
  id: string;
  balance: number;
}

interface BackendTicket {
  id: string;
  competition_id: string;
  ticket_number: number;
  purchased_at: string;
  competition: {
    id: string;
    title: string;
    slug: string;
    status: 'draft' | 'live' | 'ended' | 'completed' | 'cancelled';
    draw_date?: string;
    end_date?: string;
  };
}

interface BackendWin {
  id: string;
  ticket_number: number;
  prize_value: number;
  won_at: string;
  competition: {
    id: string;
    title: string;
    slug: string;
  };
}

// Fetchers
const walletFetcher = (url: string) =>
  api.get<BackendWallet>(url).then((res) => {
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error('Failed to fetch wallet');
  });

const ticketsFetcher = (url: string) =>
  api.get<BackendTicket[]>(url).then((res) => {
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error('Failed to fetch tickets');
  });

const winsFetcher = (url: string) =>
  api.get<BackendWin[]>(url).then((res) => {
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error('Failed to fetch wins');
  });

const transactionsFetcher = (url: string) =>
  api.get<WalletTransaction[]>(url).then((res) => {
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error('Failed to fetch transactions');
  });

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch real data
  const { data: wallet, isLoading: walletLoading } = useSWR('/wallet', walletFetcher);
  const { data: tickets, isLoading: ticketsLoading } = useSWR('/tickets/my-tickets', ticketsFetcher);
  const { data: wins, isLoading: winsLoading } = useSWR('/winners/my-wins', winsFetcher);
  const { data: transactions, isLoading: transactionsLoading } = useSWR('/wallet/transactions', transactionsFetcher);

  const isLoading = walletLoading || ticketsLoading || winsLoading || transactionsLoading;

  // Calculate stats
  const balance = wallet?.balance || 0;
  const activeTicketsCount = tickets?.length || 0;
  const totalWins = wins?.length || 0;

  // Build active competitions from tickets
  const activeCompetitions: ActiveCompetition[] = React.useMemo(() => {
    if (!tickets) return [];

    // Group tickets by competition
    const competitionMap = new Map<string, ActiveCompetition>();

    tickets.forEach((ticket) => {
      if (['live', 'draft'].includes(ticket.competition.status)) {
        const existing = competitionMap.get(ticket.competition.id);
        if (existing) {
          existing.ticketCount += 1;
        } else {
          competitionMap.set(ticket.competition.id, {
            id: ticket.competition.id,
            title: ticket.competition.title,
            slug: ticket.competition.slug,
            image: '',
            ticketCount: 1,
            endDate: ticket.competition.end_date || ticket.competition.draw_date || new Date(Date.now() + 86400000 * 7).toISOString(),
          });
        }
      }
    });

    return Array.from(competitionMap.values());
  }, [tickets]);

  // Build recent activity from transactions and tickets
  const recentActivity: ActivityItem[] = React.useMemo(() => {
    const activities: ActivityItem[] = [];

    // Add recent transactions
    if (transactions) {
      transactions.slice(0, 3).forEach((t) => {
        activities.push({
          id: `tx-${t.id}`,
          type: t.type === 'deposit' ? 'wallet_deposit' : 'order',
          description: t.description || `${t.type} transaction`,
          timestamp: t.createdAt,
        });
      });
    }

    // Add recent ticket purchases
    if (tickets) {
      tickets.slice(0, 3).forEach((t) => {
        activities.push({
          id: `ticket-${t.id}`,
          type: 'ticket_purchase',
          description: `Ticket #${t.ticket_number} for ${t.competition.title}`,
          timestamp: t.purchased_at,
        });
      });
    }

    // Sort by timestamp (newest first) and take top 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [transactions, tickets]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Guest'}!</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your competitions.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards balance={balance} activeTicketsCount={activeTicketsCount} totalWins={totalWins} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2">
          <ActiveCompetitions competitions={activeCompetitions} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
