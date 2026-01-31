import { z } from 'zod';

export const competitionQuerySchema = z.object({
  query: z.object({
    status: z.enum(['draft', 'live', 'ended', 'completed', 'cancelled']).optional(),
    category: z.string().optional(),
    featured: z.enum(['true', 'false']).optional(),
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('20'),
  }),
});

export const createCompetitionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    short_description: z.string().min(1, 'Short description is required'),
    prize_value: z.number().positive('Prize value must be positive'),
    ticket_price: z.number().positive('Ticket price must be positive'),
    total_tickets: z.number().int().positive('Total tickets must be a positive integer'),
    max_tickets_per_user: z.number().int().positive().optional().default(100),
    category: z.string().min(1, 'Category is required'),
    status: z.enum(['draft', 'live', 'ended', 'completed', 'cancelled']).optional().default('draft'),
    featured: z.boolean().optional().default(false),
    end_date: z.string().datetime('Invalid end date'),
    draw_date: z.string().datetime('Invalid draw date').optional(),
    skill_question: z.string().min(1, 'Skill question is required'),
    skill_answer: z.string().min(1, 'Skill answer is required'),
  }),
});

export const updateCompetitionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    slug: z.string().min(1, 'Slug is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    short_description: z.string().min(1, 'Short description is required').optional(),
    prize_value: z.number().positive('Prize value must be positive').optional(),
    ticket_price: z.number().positive('Ticket price must be positive').optional(),
    total_tickets: z.number().int().positive('Total tickets must be a positive integer').optional(),
    max_tickets_per_user: z.number().int().positive().optional(),
    category: z.string().min(1, 'Category is required').optional(),
    status: z.enum(['draft', 'live', 'ended', 'completed', 'cancelled']).optional(),
    featured: z.boolean().optional(),
    end_date: z.string().datetime('Invalid end date').optional(),
    draw_date: z.string().datetime('Invalid draw date').optional(),
    skill_question: z.string().min(1, 'Skill question is required').optional(),
    skill_answer: z.string().min(1, 'Skill answer is required').optional(),
  }),
});

export const verifyAnswerSchema = z.object({
  body: z.object({
    competition_id: z.string().uuid('Invalid competition ID'),
    answer: z.string().min(1, 'Answer is required'),
  }),
});
