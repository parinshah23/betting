'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DOMPurify from 'dompurify';
import { ChevronRight, Share2 } from 'lucide-react';
import { CompetitionDetail } from '@/types/competition';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { ImageGallery } from '@/components/competition/ImageGallery';
import { CompetitionInfo } from '@/components/competition/CompetitionInfo';
import { SkillQuestion } from '@/components/competition/SkillQuestion';
import { TicketSelector } from '@/components/competition/TicketSelector';

interface CompetitionClientProps {
  initialData: CompetitionDetail | null;
  slug: string;
}

const fetcher = (url: string) => api.get<CompetitionDetail>(url).then((res) => res.data);

export default function CompetitionClient({ initialData, slug }: CompetitionClientProps) {
  const { data: competition, error, isLoading } = useSWR(
    `/competitions/${slug}`,
    fetcher,
    { fallbackData: initialData || undefined }
  );

  const { user } = useAuth();
  const { addItem } = useCart();
  const { showSuccess, showError } = useToast();

  const [skillAnswer, setSkillAnswer] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (error || (!competition && !isLoading)) {
    return notFound(); // Or a custom error state
  }

  if (!competition) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
         <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Normalize competition data (handle both snake_case and camelCase from API)
  const normalizedCompetition = {
    ...competition,
    ticketPrice: competition.ticketPrice || competition.ticket_price || 0,
    totalTickets: competition.totalTickets || competition.total_tickets || 0,
    soldTickets: competition.soldTickets || competition.sold_tickets || 0,
    maxTicketsPerUser: competition.maxTicketsPerUser || competition.max_tickets_per_user || 0,
    prizeValue: competition.prizeValue || competition.prize_value || 0,
    skillQuestion: competition.skillQuestion || competition.skill_question || '',
    skillAnswer: competition.skillAnswer || competition.skill_answer || '',
    endDate: competition.endDate || competition.end_date || '',
    instantWinsRemaining: competition.instantWinsRemaining || competition.instant_wins_remaining || 0,
  };

  const handleVerified = (answer: string) => {
    setSkillAnswer(answer);
  };

  const handleAddToCart = async (quantity: number) => {
    if (!user) {
      showError('Please login to purchase tickets');
      // Redirect to login logic could go here, or just show toast
      return;
    }

    if (!skillAnswer) {
      showError('Please answer the skill question correctly');
      return;
    }

    setIsAddingToCart(true);
    try {
      const success = await addItem(normalizedCompetition.id, quantity, skillAnswer);
      if (success) {
        showSuccess(`Added ${quantity} tickets to cart!`);
      } else {
        // Error handled in context usually, but we can double check
      }
    } catch (err) {
      showError('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const remainingTickets = normalizedCompetition.totalTickets - normalizedCompetition.soldTickets;
  const isSoldOut = normalizedCompetition.status === 'sold_out' || remainingTickets <= 0;
  const isEnded = normalizedCompetition.status === 'ended' || normalizedCompetition.status === 'completed';

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/competitions" className="hover:text-primary-600">Competitions</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-medium truncate max-w-[200px]">{normalizedCompetition.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Images & Description */}
        <div className="lg:col-span-7 space-y-8">
          <ImageGallery images={normalizedCompetition.images} />

          {/* Description - Mobile: Show after info, Desktop: Show here */}
          <div className="hidden lg:block space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900">Prize Details</h2>
            <div 
              className="prose prose-neutral max-w-none text-neutral-600"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(normalizedCompetition.description) }}
            />
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="lg:col-span-5 space-y-8">
          <CompetitionInfo competition={normalizedCompetition} />

          {/* Action Area */}
          {!isEnded && !isSoldOut ? (
            <div className="space-y-6">
              {/* Skill Question */}
              <SkillQuestion 
                question={normalizedCompetition.skillQuestion}
                competitionId={normalizedCompetition.id}
                onVerified={handleVerified}
                disabled={!!skillAnswer} // Disable once verified
              />

              {/* Ticket Selector */}
              <div className={!skillAnswer ? "opacity-50 pointer-events-none grayscale transition-all" : "transition-all"}>
                <TicketSelector
                  ticketPrice={normalizedCompetition.ticketPrice}
                  maxQuantity={Math.min(normalizedCompetition.maxTicketsPerUser, remainingTickets)}
                  onAddToCart={handleAddToCart}
                  isLoading={isAddingToCart}
                  disabled={!skillAnswer}
                />
              </div>
            </div>
          ) : (
            <div className="bg-neutral-100 rounded-xl p-8 text-center border border-neutral-200">
              {isSoldOut ? (
                <>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Sold Out!</h3>
                  <p className="text-neutral-600">
                    All tickets for this competition have been sold. 
                    The draw will take place on {new Date(competition.drawDate || competition.endDate).toLocaleDateString()}.
                  </p>
                </>
              ) : (
                 <>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Competition Ended</h3>
                  <p className="text-neutral-600">
                    This competition has ended. 
                    {competition.winner && (
                      <span className="block mt-2 font-medium text-primary-600">
                        Winner: {competition.winner.displayName} (Ticket #{competition.winner.ticketNumber})
                      </span>
                    )}
                  </p>
                </>
              )}
               <Button href="/competitions" variant="outline" className="mt-6 w-full">
                View Other Competitions
              </Button>
            </div>
          )}

           {/* Mobile Description */}
           <div className="lg:hidden space-y-6 pt-6 border-t border-neutral-100">
            <h2 className="text-2xl font-bold text-neutral-900">Prize Details</h2>
            <div 
              className="prose prose-neutral max-w-none text-neutral-600"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(competition.description) }}
            />
          </div>
          
           {/* Share */}
           <div className="flex justify-center">
            <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 transition-colors">
              <Share2 className="w-4 h-4" />
              Share this competition
            </button>
           </div>
        </div>
      </div>
    </div>
  );
}
