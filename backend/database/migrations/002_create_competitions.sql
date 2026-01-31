CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    prize_value DECIMAL(10, 2) NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    total_tickets INTEGER NOT NULL,
    max_tickets_per_user INTEGER DEFAULT 100,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'ended', 'completed', 'cancelled')),
    featured BOOLEAN DEFAULT FALSE,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    draw_date TIMESTAMP WITH TIME ZONE,
    winner_user_id UUID REFERENCES users(id),
    winning_ticket_number INTEGER,
    skill_question VARCHAR(255) NOT NULL,
    skill_answer VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_end_date ON competitions(end_date);
CREATE INDEX idx_competitions_slug ON competitions(slug);
