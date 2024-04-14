-- CREATE DATABASE safebet_db;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(16) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    first_name VARCHAR(24) NOT NULL,
    last_name VARCHAR(24) NOT NULL,
    email VARCHAR(24) NOT NULL,
    birth_date DATE NOT NULL,
    register_date DATE
    -- PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS events (
    event_id VARCHAR(32) NOT NULL,
    team_f VARCHAR(24) NOT NULL,
    team_n VARCHAR(24) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    outcome_f BOOLEAN, 
    PRIMARY KEY(event_id)
);

CREATE TABLE IF NOT EXISTS sportsbooks (
    sportsbook_id SERIAL PRIMARY KEY,
    sportsbook_name VARCHAR(32) NOT NULL,
    sportsbook_url VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS deals (
    deal_id SERIAL PRIMARY KEY,
    sportsbook_id INT,
    deal_type VARCHAR(24) NOT NULL,
    amount DECIMAL(15,2),
    FOREIGN KEY (sportsbook_id) REFERENCES sportsbooks(sportsbook_id)
);

CREATE TABLE IF NOT EXISTS odds (
    sportsbook_id INT NOT NULL,
    event_id VARCHAR(32) NOT NULL,
    odds_f INT NOT NULL,
    odds_n INT NOT NULL,
    PRIMARY KEY(sportsbook_id, event_id),
    FOREIGN KEY(sportsbook_id) REFERENCES sportsbooks(sportsbook_id),
    FOREIGN KEY(event_id) REFERENCES events(event_id)
);

CREATE TABLE IF NOT EXISTS bets (
    bet_id SERIAL PRIMARY KEY,
    event_id VARCHAR(32) NOT NULL,
    bet_value DECIMAL(15,2) NOT NULL,
    winnings DECIMAL(15,2),
    deal_id INT NOT NULL,
    -- PRIMARY KEY(bet_id),
    FOREIGN KEY(event_id) REFERENCES events(event_id),
    FOREIGN KEY(deal_id) REFERENCES deals(deal_id)
);

CREATE TABLE IF NOT EXISTS userHistory (
    user_id INT NOT NULL,
    bet_id INT NOT NULL,
    PRIMARY KEY(user_id, bet_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(bet_id) REFERENCES bets(bet_id)
);

CREATE TABLE IF NOT EXISTS sports (
    sport_id SERIAL PRIMARY KEY,
    sport_key VARCHAR(64) NOT NULL,
    sport_name VARCHAR(32) NOT NULL,
    sport_league VARCHAR(16) NOT NULL
);