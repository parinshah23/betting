export interface CompetitionImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface CompetitionDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  short_description?: string;
  prizeValue: number;
  prize_value?: number;
  ticketPrice: number;
  ticket_price?: number;
  totalTickets: number;
  total_tickets?: number;
  soldTickets: number;
  sold_tickets?: number;
  maxTicketsPerUser: number;
  max_tickets_per_user?: number;
  category: string;
  status: 'live' | 'ended' | 'sold_out' | 'completed' | 'draft' | 'cancelled';
  endDate: string;
  end_date?: string;
  drawDate: string | null;
  draw_date?: string | null;
  skillQuestion: string;
  skill_question?: string;
  skillAnswer?: string;
  skill_answer?: string;
  images: CompetitionImage[];
  instantWinsRemaining: number;
  instant_wins_remaining?: number;
  winner?: {
    displayName: string;
    ticketNumber: number;
  };
}

export interface VerifyAnswerRequest {
  competitionId: string;
  answer: string;
}

export interface VerifyAnswerResponse {
  success: boolean;
  correct?: boolean;
  is_correct?: boolean;
  message?: string;
}

export interface AddToCartRequest {
  competitionId: string;
  quantity: number;
  skillAnswer: string;
}
