'use client';

import { Badge } from '@/components/ui/Badge';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency, calculateProgress } from '@/lib/utils';
import { CompetitionDetail } from '@/types/competition';
import { Clock, Ticket, Trophy, Zap } from 'lucide-react';

interface CompetitionInfoProps {
  competition: CompetitionDetail;
}

export function CompetitionInfo({ competition }: CompetitionInfoProps) {
  const progress = calculateProgress(competition.soldTickets, competition.totalTickets);
  const isSoldOut = competition.status === 'sold_out' || competition.soldTickets >= competition.totalTickets;
  const isEnded = competition.status === 'ended' || competition.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Badges & Title */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant={competition.status === 'live' ? 'success' : 'default'} className="uppercase">
            {competition.status.replace('_', ' ')}
          </Badge>
          {competition.instantWinsRemaining > 0 && (
            <Badge variant="warning" className="flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              {competition.instantWinsRemaining} Instant Wins Left
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
          {competition.title}
        </h1>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary-600">
            {formatCurrency(competition.ticketPrice)}
          </span>
          <span className="text-neutral-500 font-medium">per ticket</span>
        </div>
      </div>

      {/* Countdown & Stats */}
      {!isEnded && !isSoldOut && (
        <div className="bg-neutral-900 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4 text-neutral-300">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Time Remaining</span>
          </div>
          <CountdownTimer 
            endDate={new Date(competition.endDate)} 
            variant="large"
          />
        </div>
      )}

      {/* Progress */}
      <div className="space-y-3 p-5 bg-neutral-50 rounded-xl border border-neutral-200">
        <div className="flex justify-between items-end text-sm">
          <div className="flex items-center gap-2 font-medium text-neutral-700">
            <Ticket className="w-4 h-4 text-primary-500" />
            <span>Tickets Sold</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-neutral-900">{competition.soldTickets}</span>
            <span className="text-neutral-500"> / {competition.totalTickets}</span>
          </div>
        </div>
        
        <ProgressBar 
          value={progress} 
          variant={progress > 90 ? 'danger' : 'default'} 
          size="md"
          animated
          showLabel
        />

        <p className="text-xs text-neutral-500 text-center">
          Guaranteed draw regardless of ticket sales!
        </p>
      </div>

      {/* Prize Value */}
      <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800">
        <div className="p-2 bg-yellow-100 rounded-full">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-yellow-700">Total Prize Value</p>
          <p className="text-xl font-bold">{formatCurrency(competition.prizeValue)}</p>
        </div>
      </div>
    </div>
  );
}
