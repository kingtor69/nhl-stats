DROP TABLE users IF EXISTS;
DROP TABLE players IF EXISTS;
-- only contians player name and id for searching on APIs
DROP TABLE users_players IF EXISTS;
DROP TABLE teams IF EXISTS;
DROP TABLE users_teams IF EXISTS;
DROP TABLE preferences IF EXISTS;
DROP TABLE users_preferences IF EXISTS;

CREATE TABLE users (
    username VARCHAR(24) PRIMARY KEY,
    email VARCHAR(50),
    password VARCHAR(48) NOT NULL,
    first_name VARCHAR(48),
    last_name VARCHAR(48),
    bio VARCHAR(256),
);

CREATE TABLE players (
    id INT PRIMARY KEY,
    name VARCHAR(48) NOT NULL,
    team_id INT NOT NULL FOREIGN KEY REFERENCES teams.id,
);

CREATE TABLE teams (
    id INT PRIMARY KEY,
    city VARCHAR(48) NOT NULL,
    mascot VARCHAR(48) NOT NULL,
);

CREATE TABLE users_players (
    player_id INT PRIMARY KEY FOREIGN KEY REFERENCES players.id,
    username VARCHAR(24) PRIMARY KEY FOREIGN KEY REFERENCES users.username,
);

CREATE TABLE users_teams (
    team_id INT PRIMARY KEY FOREIGN KEY REFERENCES teams.id,
    username VARCHAR(24) PRIMARY KEY FOREIGN KEY REFERENCES users.username,
);

CREATE TABLE preferences (
    username VARCHAR(24) PRIMARY KEY FOREIGN KEY REFERENCES users.username,
    is_dark_mode BOOLEAN NOT NULL DEFAULT t,
    is_metric BOOLEAN NOT NULL DEFAULT f,
);
