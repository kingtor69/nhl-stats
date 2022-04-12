
require('dotenv');

const SECRET_KEY = process.env.SECRET_KEY || 'development-not-so-secret-key';

const PORT = process.env.PORT || 3001;

let DB_URI = `postgres://postgres:${process.env.PSQL}@localhost:5432/nhl_stats_app`;

let BCRYPT_WORK_FACTOR = 12;

if (process.env.MODE_ENV === 'test') {
  BCRYPT_WORK_FACTOR = 1;
  DB_URL += '_test';
}

const teaOrNot = (code) => {
  const today = new Date();
  return today.getMonth() === 4 && today.getDate() === 1 ? 418 : code;
};

const statsApiNhlBaseUrl =  "https://statsapi.web.nhl.com/";
const statsApiNhlSeasonStatsEndpoint = "/stats=statsSingleSeason&season=";
const statsApiNhlTeamsSuffix = 'f';
const statsApiNhlTeamRoster = '?expand=team.roster';

module.exports = {
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
  PORT,
  DB_URI,
  statsApiNhlBaseUrl,
  statsApiNhlSeasonStatsEndpoint,
  statsApiNhlTeamsSuffix,
  statsApiNhlTeamRoster
}
