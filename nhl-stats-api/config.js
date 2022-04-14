
require('dotenv');

const SECRET_KEY = process.env.SECRET_KEY || 'development-not-so-secret-key';

const PORT = process.env.PORT || 3001;

let DB_URI_TEMP = `postgres://postgres:${process.env.PSQL}@localhost:5432/nhl_stats_app`;

let BCRYPT_WORK_FACTOR_TEMP = 3;

if (process.env.NODE_ENV === 'test') {
  BCRYPT_WORK_FACTOR_TEMP = 1;
  DB_URI_TEMP += '_test';
}

const DB_URI = DB_URI_TEMP;
const BCRYPT_WORK_FACTOR = BCRYPT_WORK_FACTOR_TEMP;

const teaOrNot = (code) => {
  // testing is no joking matter:
  if (process.env.NODE_ENV === "test") return code;
  // but tea pots are:
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
  teaOrNot,
  statsApiNhlBaseUrl,
  statsApiNhlSeasonStatsEndpoint,
  statsApiNhlTeamsSuffix,
  statsApiNhlTeamRoster
}
