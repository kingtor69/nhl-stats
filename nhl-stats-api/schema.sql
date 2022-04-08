
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS players CASCADE;
-- only contians player name and id for searching on APIs
DROP TABLE IF EXISTS users_players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users_teams CASCADE;
DROP TABLE IF EXISTS preferences CASCADE;

CREATE TABLE users (
    username VARCHAR(24) PRIMARY KEY,
    email VARCHAR(50),
    password VARCHAR(48) NOT NULL,
    first_name VARCHAR(48),
    last_name VARCHAR(48),
    bio VARCHAR(256),
    is_admin BOOLEAN NOT NULL DEFAULT 'false'
);

CREATE TABLE teams (
    id INT PRIMARY KEY,
    city VARCHAR(48) NOT NULL,
    mascot VARCHAR(48) NOT NULL
);

CREATE TABLE players (
    id INT PRIMARY KEY,
    name VARCHAR(48) NOT NULL,
    team_id INT NOT NULL REFERENCES teams(id)
);

CREATE TABLE users_players (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id),
    user_name VARCHAR(24) NOT NULL REFERENCES users(username)
);

CREATE TABLE users_teams (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(id),
    user_name VARCHAR(24) NOT NULL REFERENCES users(username)
);

CREATE TABLE preferences (
    user_name VARCHAR(24) PRIMARY KEY REFERENCES users(username),
    is_dark_mode BOOLEAN NOT NULL DEFAULT 'true',
    is_metric BOOLEAN NOT NULL DEFAULT 'false'
);

