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
  prizeValue: number;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  maxTicketsPerUser: number;
  category: string;
  status: 'live' | 'ended' | 'sold_out' | 'completed' | 'draft' | 'cancelled';
  endDate: string;
  drawDate: string | null;
  skillQuestion: string;
  images: CompetitionImage[];
  instantWinsRemaining: number;
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
  correct: boolean;
  message?: string;
}

export interface AddToCartRequest {
  competitionId: string;
  quantity: number;
  skillAnswer: string;
}
