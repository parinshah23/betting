CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    order_id UUID, -- FK to orders(id), added in 005_create_orders.sql
    ticket_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    is_instant_win BOOLEAN DEFAULT FALSE,
    instant_win_prize VARCHAR(255),
    instant_win_claimed BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (competition_id, ticket_number)
);

CREATE INDEX idx_tickets_competition ON tickets(competition_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_instant_win ON tickets(is_instant_win) WHERE is_instant_win = TRUE;
