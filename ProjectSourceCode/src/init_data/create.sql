CREATE TABLE IF NOT EXISTS users (
    user_id int NOT NULL AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(24) NOT NULL,
    first_name VARCHAR(24),
    last_name VARCHAR(24),
    email VARCHAR(24) NOT NULL,
    birth_date DATE,
    register_date DATE,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS events (
    event_id VARCHAR(32) NOT NULL,
    team_f VARCHAR(24) NOT NULL,
    team_n VARCHAR(24) NOT NULL,
    event_date DATETIME NOT NULL,
    outome_f BOOLEAN, 
    PRIMARY KEY(event_id)
);

CREATE TABLE IF NOT EXISTS sportsbooks (
    sportsbook_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL,
    url VARCHAR(200),
    PRIMARY KEY(sportsbook_id)
);

CREATE TABLE IF NOT EXISTS deals (
    deal_id INT NOT NULL AUTO_INCREMENT,
    sportsbook_id INT NOT NULL,
    type VARCHAR(24) NOT NULL,
    amount DECIMAL(15,2),
    PRIMARY KEY(deal_id),
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
    bet_id INT NOT NULL AUTO_INCREMENT,
    event_id VARCHAR(32) NOT NULL,
    bet_value DECIMAL(15,2) NOT NULL,
    winnings DECIMAL(15,2),
    deal_id INT NOT NULL,
    PRIMARY KEY(bet_id),
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
-- IF NOT EXISTS users
-- CREATE TABLE users (
--     user_id int NOT NULL AUTO_INCREMENT,
--     username VARCHAR(16) NOT NULL,
--     password VARCHAR(24) NOT NULL,
--     first_name VARCHAR(24),
--     last_name VARCHAR(24),
--     email VARCHAR(24) NOT NULL,
--     birth_date DATE,
--     register_date DATE,
--     PRIMARY KEY (user_id)
-- );

-- IF NOT EXISTS events
-- CREATE TABLE events (
--     event_id VARCHAR(32) NOT NULL,
--     team_f VARCHAR(24) NOT NULL,
--     team_n VARCHAR(24) NOT NULL,
--     event_date DATETIME NOT NULL,
--     outome_f BOOLEAN, 
--     PRIMARY KEY(event_id)
-- );

-- IF NOT EXISTS sportsbooks
-- CREATE TABLE sportsbooks (
--     sportsbook_id INT NOT NULL AUTO_INCREMENT,
--     name VARCHAR(32) NOT NULL,
--     url VARCHAR(200),
--     PRIMARY KEY(sportsbook_id)
-- );

-- IF NOT EXISTS deals
-- CREATE TABLE deals (
--     deal_id INT NOT NULL AUTO_INCREMENT,
--     sportsbook_id INT NOT NULL,
--     type VARCHAR(24) NOT NULL,
--     amount DECIMAL(15,2),
--     PRIMARY KEY(deal_id),
--     FOREIGN KEY (sportsbook_id) REFERENCES sportsbooks(sportsbook_id)
-- );

-- IF NOT EXISTS odds
-- CREATE TABLE odds (
--     sportsbook_id INT NOT NULL,
--     event_id VARCHAR(32) NOT NULL,
--     odds_f INT NOT NULL,
--     odds_n INT NOT NULL,
--     PRIMARY KEY(sportsbook_id, event_id),
--     FOREIGN KEY(sportsbook_id) REFERENCES sportsbooks(sportsbook_id),
--     FOREIGN KEY(event_id) REFERENCES events(event_id)
-- );

-- IF NOT EXISTS bets
-- CREATE TABLE bets (
--     bet_id INT NOT NULL AUTO_INCREMENT,
--     event_id VARCHAR(32) NOT NULL,
--     bet_value DECIMAL(15,2) NOT NULL,
--     winnings DECIMAL(15,2),
--     deal_id INT NOT NULL,
--     PRIMARY KEY(bet_id),
--     FOREIGN KEY(event_id) REFERENCES events(event_id),
--     FOREIGN KEY(deal_id) REFERENCES deals(deal_id)
-- );

-- IF NOT EXISTS userHistory
-- CREATE TABLE userHistory (
--     user_id INT NOT NULL,
--     bet_id INT NOT NULL,
--     PRIMARY KEY(user_id, bet_id),
--     FOREIGN KEY(user_id) REFERENCES users(user_id),
--     FOREIGN KEY(bet_id) REFERENCES bets(bet_id)
-- );