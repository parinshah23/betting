'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, Ticket, Trophy, Plus, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface StatsCardsProps {
  balance: number;
  activeTicketsCount: number;
  totalWins: number;
}

export function StatsCards({ balance, activeTicketsCount, totalWins }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Wallet Card */}
      <Card className="bg-white border-l-4 border-l-primary-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Wallet Balance</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(balance)}</h3>
            </div>
            <div className="p-2 bg-primary-50 rounded-lg">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/wallet">
              <Button size="sm" variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Top Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Active Tickets Card */}
      <Card className="bg-white border-l-4 border-l-accent-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900">{activeTicketsCount}</h3>
            </div>
            <div className="p-2 bg-accent-50 rounded-lg">
              <Ticket className="w-6 h-6 text-accent-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/my-tickets">
              <Button size="sm" variant="outline" className="w-full">
                View Tickets <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Wins Card */}
      <Card className="bg-white border-l-4 border-l-success shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Wins</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalWins}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/my-wins">
              <Button size="sm" variant="outline" className="w-full">
                View Wins <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
