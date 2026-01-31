'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import type { Competition } from '@/types';
import { Ticket, Clock } from 'lucide-react';

interface CompetitionCardProps {
  competition: Competition;
  variant?: 'default' | 'compact';
}

export function CompetitionCard({ competition, variant = 'default' }: CompetitionCardProps) {
  const soldTickets = competition.sold_tickets ?? competition.soldTickets ?? 0;
  const totalTickets = competition.total_tickets ?? competition.totalTickets ?? 1;
  const percentageSold = Math.round((soldTickets / totalTickets) * 100);
  const isEndingSoon = percentageSold >= 80;
  const endDate = competition.end_date || competition.endDate || new Date().toISOString();
  const ticketPrice = Number(competition.ticket_price || competition.ticketPrice || 0);
  const prizeValue = Number(competition.prize_value || competition.prizeValue || 0);
  const images = competition.images || [];
  const title = competition.title || '';
  const category = competition.category || 'General';
  const shortDescription = competition.short_description || competition.shortDescription || '';

  if (variant === 'compact') {
    return (
      <Link href={`/competitions/${competition.slug}`}>
        <Card hoverable padding="none" className="overflow-hidden">
          <div className="relative h-40">
            {images[0] ? (
              <Image
                src={images[0].url}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Ticket className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <CountdownTimer endDate={endDate} variant="compact" showLabels={false} />
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-primary-600">£{ticketPrice}</span>
              <span className="text-xs text-gray-500">{percentageSold}% sold</span>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/competitions/${competition.slug}`}>
      <Card hoverable padding="none" className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48">
          {images[0] ? (
            <Image
              src={images[0].url}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Ticket className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {competition.featured && (
            <Badge variant="warning" className="absolute top-2 left-2">
              Featured
            </Badge>
          )}
          {isEndingSoon && (
            <Badge variant="danger" className="absolute top-2 right-2">
              Ending Soon
            </Badge>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <CountdownTimer endDate={endDate} variant="compact" showLabels={false} />
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <Badge variant="default" size="sm" className="w-fit mb-2">
            {category}
          </Badge>
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
            {shortDescription}
          </p>

          <div className="space-y-3">
            <ProgressBar
              value={soldTickets}
              max={totalTickets}
              showLabel
              size="sm"
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ticket Price</p>
                <p className="text-xl font-bold text-primary-600">£{ticketPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Value</p>
                <p className="text-lg font-semibold text-gray-900">£{prizeValue.toLocaleString()}</p>
              </div>
            </div>
            <Button className="w-full" size="lg">
              Enter Now
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface CompetitionGridProps {
  competitions: Competition[];
  isLoading?: boolean;
}

export function CompetitionGrid({ competitions, isLoading }: CompetitionGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CompetitionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!competitions || competitions.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No competitions available</h3>
        <p className="text-gray-500 mt-1">Check back soon for new competitions!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {competitions.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} />
      ))}
    </div>
  );
}

function CompetitionCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-48 bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
        <div className="h-2 bg-gray-200 rounded w-full mb-2 animate-pulse" />
        <div className="flex justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
      </div>
    </div>
  );
}
