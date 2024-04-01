IF NOT EXISTS users
CREATE TABLE users (
    user_id int NOT NULL AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(24) NOT NULL,
    first_name VARCHAR(24),
    last_name VARCHAR(24),
    email VARCHAR(24) NOT NULL,
    birth_date DATE,
    register_date DATE,
    PRIMARY KEY (userID)
);

IF NOT EXISTS events
CREATE TABLE events (
    game_id VARCHAR(32) NOT NULL,
    team_f VARCHAR(24) NOT NULL,
    team_n VARCHAR(24) NOT NULL,
    odds_f INT NOT NULL,
    odds_n INT NOT NULL,
    outome_f BOOLEAN, 
    PRIMARY KEY(bet_id),
    FOREIGN KEY(game_id) REFERENCES eventTable(game_id)
);

IF NOT EXISTS bets
CREATE TABLE bets (
    bet_id INT NOT NULL AUTO_INCREMENT,
    game_id INT NOT NULL,
    bet_value DECIMAL(15,2) NOT NULL,
    winnings DECIMAL(15,2),
    deal_id INT NOT NULL,
    PRIMARY KEY(bet_id),
    FOREIGN KEY(game_id) REFERENCES events(game_id),
    FOREIGN KEY(deal_id) REFERENCES deals(deal_id)
);

IF NOT EXISTS userHistory
CREATE TABLE userHistory (
    user_id INT NOT NULL,
    bet_id INT NOT NULL,
    PRIMARY KEY(user_id, bet_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(bet_id) REFERENCES bets(bet_id)
);

IF NOT EXISTS deals
CREATE TABLE deals (
    deal_id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(24) NOT NULL,
    amount DECIMAL(15,2),
);