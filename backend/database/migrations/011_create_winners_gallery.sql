CREATE TABLE winners_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id),
    user_id UUID NOT NULL REFERENCES users(id),
    display_name VARCHAR(100), -- For privacy: "John D."
    testimonial TEXT,
    photo_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_winners_gallery_competition ON winners_gallery(competition_id);
