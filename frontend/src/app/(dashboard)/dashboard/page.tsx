'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ActiveCompetitions, ActiveCompetition } from '@/components/dashboard/ActiveCompetitions';
import { RecentActivity, ActivityItem } from '@/components/dashboard/RecentActivity';

// Mock Data Generators (Replace with API calls later)
const MOCK_STATS = {
  balance: 125.50,
  activeTicketsCount: 27,
  totalWins: 3,
};

const MOCK_COMPETITIONS: ActiveCompetition[] = [
  {
    id: '1',
    title: 'Win a Tesla Model 3',
    slug: 'win-tesla-model-3',
    image: '', // Placeholder will be used
    ticketCount: 12,
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
  },
  {
    id: '2',
    title: 'PlayStation 5 Bundle',
    slug: 'ps5-bundle',
    image: '',
    ticketCount: 5,
    endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
  },
  {
    id: '3',
    title: '£1000 Cash Prize',
    slug: '1000-cash',
    image: '',
    ticketCount: 10,
    endDate: new Date(Date.now() + 86400000 * 1).toISOString(),
  },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'ticket_purchase',
    description: 'Purchased 5 tickets for Watch Draw',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    type: 'instant_win',
    description: 'Won £50 Instant Prize!',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    type: 'wallet_deposit',
    description: 'Added £100 to wallet',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Guest'}!
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your competitions.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards 
        balance={MOCK_STATS.balance}
        activeTicketsCount={MOCK_STATS.activeTicketsCount}
        totalWins={MOCK_STATS.totalWins}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2">
          <ActiveCompetitions competitions={MOCK_COMPETITIONS} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1">
          <RecentActivity activities={MOCK_ACTIVITY} />
        </div>
      </div>
    </div>
  );
}
