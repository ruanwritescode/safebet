-- CREATE DATABASE safebet_db;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL,
    birth_date DATE NOT NULL,
    register_date DATE
);

CREATE TABLE IF NOT EXISTS sports (
    sport_id SERIAL PRIMARY KEY,
    sport_key VARCHAR(64) NOT NULL UNIQUE,
    sport_name VARCHAR(64) NOT NULL,
    sport_league VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS sportsbooks (
    sportsbook_id SERIAL PRIMARY KEY,
    sportsbook_name VARCHAR(32) NOT NULL,
    sportsbook_url VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS events (
    event_id VARCHAR(64) NOT NULL PRIMARY KEY,
    sport_id INT NOT NULL,
    team_f VARCHAR(64) NOT NULL,
    team_n VARCHAR(64) NOT NULL,
    event_date TIMESTAMP NOT NULL,
    outcome CHAR(1) DEFAULT '0', 
    FOREIGN KEY (sport_id) REFERENCES sports(sport_id)
);

CREATE TABLE IF NOT EXISTS deals (
    deal_id SERIAL PRIMARY KEY,
    sportsbook_id INT NOT NULL,
    deal_type VARCHAR(24) NOT NULL,
    deal_amount DECIMAL(15,2) NOT NULL,
    deal_line INT NOT NULL,
    FOREIGN KEY(sportsbook_id) REFERENCES sportsbooks(sportsbook_id)
);

CREATE TABLE IF NOT EXISTS hedges (
    hedge_id SERIAL PRIMARY KEY,
    sportsbook_id INT NOT NULL,
    hedge_amount DECIMAL(15,2) NOT NULL,
    hedge_line INT NOT NULL,
    FOREIGN KEY(sportsbook_id) REFERENCES sportsbooks(sportsbook_id)
);

CREATE TABLE IF NOT EXISTS bets (
    bet_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    event_id VARCHAR(32) NOT NULL,
    deal_id INT NOT NULL,
    hedge_id INT NOT NULL,
    winnings DECIMAL(15,2),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(event_id) REFERENCES events(event_id),
    FOREIGN KEY(deal_id) REFERENCES deals(deal_id),
    FOREIGN KEY(hedge_id) REFERENCES hedges(hedge_id)
);