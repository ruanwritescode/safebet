IF NOT EXISTS users
CREATE TABLE users (
    userID int NOT NULL AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(24) NOT NULL,
    email VARCHAR(24) NOT NULL,
    registerDate DATETIME,
    PRIMARY KEY (userID)
);