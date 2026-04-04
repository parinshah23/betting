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

        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {competition.title}
        </h1>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#3ACBE8]">
            {formatCurrency(competition.ticketPrice)}
          </span>
          <span className="text-white/50 font-medium">per ticket</span>
        </div>
      </div>

      {/* Countdown */}
      {!isEnded && !isSoldOut && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4 text-white/50">
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
      <div className="space-y-3 p-5 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex justify-between items-end text-sm">
          <div className="flex items-center gap-2 font-medium text-white/70">
            <Ticket className="w-4 h-4 text-[#3ACBE8]" />
            <span>Tickets Sold</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-white">{competition.soldTickets}</span>
            <span className="text-white/40"> / {competition.totalTickets}</span>
          </div>
        </div>

        <ProgressBar
          value={progress}
          variant={progress > 90 ? 'danger' : 'default'}
          size="md"
          animated
          showLabel
        />

        <p className="text-xs text-white/40 text-center">
          Guaranteed draw regardless of ticket sales!
        </p>
      </div>

      {/* Prize Value */}
      <div className="flex items-center gap-4 p-4 bg-[#0160C9]/10 border border-[#0160C9]/20 rounded-lg">
        <div className="p-2 bg-[#0160C9]/20 rounded-full">
          <Trophy className="w-6 h-6 text-[#3ACBE8]" />
        </div>
        <div>
          <p className="text-sm font-medium text-white/50">Total Prize Value</p>
          <p className="text-xl font-bold text-white">{formatCurrency(competition.prizeValue)}</p>
        </div>
      </div>
    </div>
  );
}
