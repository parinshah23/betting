/**
 * Shared TypeScript Types
 *
 * Core types used throughout the application.
 */

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

// Competition Types
export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  shortDescription?: string;
  prize_value?: number | string;
  prizeValue?: number | string;
  ticket_price?: number | string;
  ticketPrice?: number | string;
  total_tickets?: number;
  totalTickets?: number;
  sold_tickets?: number;
  soldTickets?: number;
  max_tickets_per_user?: number;
  maxTicketsPerUser?: number;
  category?: string | null;
  status: 'draft' | 'live' | 'ended' | 'completed' | 'cancelled';
  featured?: boolean;
  end_date?: string;
  endDate?: string;
  draw_date?: string | null;
  drawDate?: string | null;
  skill_question?: string;
  skillQuestion?: string;
  images?: CompetitionImage[];
  winner?: {
    displayName?: string;
    ticketNumber?: number;
  };
}

export interface CompetitionImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

// Ticket Types
export interface Ticket {
  id: string;
  competitionId: string;
  userId: string;
  ticketNumber: number;
  isInstantWin: boolean;
  instantWinPrize?: string;
  purchasedAt: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  subtotal: number;
  discountAmount: number;
  walletAmountUsed: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  competitionId: string;
  competitionTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Wallet Types
export interface Wallet {
  id: string;
  balance: number;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'spend' | 'cashback' | 'refund' | 'admin_credit' | 'admin_debit';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  competitionId: string;
  competitionTitle: string;
  competitionSlug: string;
  competitionImage: string;
  ticketPrice: number;
  quantity: number;
  maxQuantity: number;
  subtotal: number;
  competitionEndDate: string;
  competitionStatus: 'live' | 'ended' | 'sold_out';
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  promoCode?: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    savings: number;
  };
}

// API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Winner Types
export interface Winner {
  id: string;
  competitionId: string;
  userId: string;
  ticketNumber: number;
  prizeValue: number;
  wonAt: string;
  claimed: boolean;
  claimDate?: string;
  prizeType?: 'physical' | 'cash' | 'voucher';
  deliveryStatus?: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  claimAddress?: string;
  competition: {
    id: string;
    title: string;
    slug: string;
    prizeValue: number;
    imageUrl?: string;
  };
}

// Promo Code Types
export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
}

