
const today = new Date();
const startYear = today.getMonth() > 8 ? today.getYear() : today.getYear() - 1;
const thisSeason = `{startYear}{startYear + 1}`;
const lastSeason = `{startYear-1}{startYear}`;
const statsApiNhlBaseUrl =  "https://statsapi.web.nhl.com/";
const statsApiNhlSeasonStatsEndpoint = "/stats=statsSingleSeason&season=";
const statsApiNhlTeamsSuffix = 'f';
const statsApiNhlTeamRoster = '?expand=team.roster';

module.exports = {
  statsApiNhlBaseUrl,
  statsApiNhlSeasonStatsEndpoint,
  thisSeason,
  lastSeason,
  statsApiNhlTeamsSuffix,
  statsApiNhlTeamRoster
};
 