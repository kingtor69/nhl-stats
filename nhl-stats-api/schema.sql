
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS players;
-- only contians player name and id for searching on APIs
DROP TABLE IF EXISTS users_players;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS users_teams;
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS users_preferences;

CREATE TABLE users (
    username VARCHAR(24) PRIMARY KEY,
    email VARCHAR(50),
    password VARCHAR(48) NOT NULL,
    first_name VARCHAR(48),
    last_name VARCHAR(48),
    bio VARCHAR(256)
);

CREATE TABLE players (
    id INT PRIMARY KEY,
    name VARCHAR(48) NOT NULL,
    team_id INT NOT NULL
);

CREATE TABLE teams (
    id INT PRIMARY KEY,
    city VARCHAR(48) NOT NULL,
    mascot VARCHAR(48) NOT NULL
);

CREATE TABLE users_players (
    id SERIAL PRIMARY KEY,
    player_id INT,
    username VARCHAR(24) 
);

CREATE TABLE users_teams (
    id SERIAL PRIMARY KEY,
    team_id INT,
    username VARCHAR(24)
);

CREATE TABLE preferences (
    username VARCHAR(24) PRIMARY KEY,
    is_dark_mode BOOLEAN NOT NULL DEFAULT t,
    is_metric BOOLEAN NOT NULL DEFAULT f
);


ALTER TABLE teams 
    ADD FOREIGN KEY (team_id) REFERENCES teams(id);

ALTER TABLE users_players 
     ADD FOREIGN KEY (players_id) REFERENCES players(id),
     ADD FOREIGN KEY (username) REFERENCES users(usename);

ALTER TABLE users_teams 
    ADD FOREIGN KEY (team_id) REFERENCES teams(id),
    ADD FOREIGN KEY (username) REFERENCES users(username);

ALTER TABLE preferences 
    ADD FOREIGN KEY (username) REFERENCES users(username);
