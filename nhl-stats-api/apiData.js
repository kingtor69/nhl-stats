
const today = new Date();
const startYear = today.getMonth() > 8 ? today.getYear() : today.getYear() - 1;
const thisSeason = `{startYear}{startYear + 1}`;
const lastSeason = `{startYear-1}{startYear}`;
const statsApiNHLBaseUrl:  "https://statsapi.web.nhl.com/";
const statsApiNhlSeasonStatsEndpoint = "/stats=statsSingleSeason&season=";
const statsApiNhlTeamsSuffix = 'f';
const statsApiNhlTeamRoster = '?expand=team.roster';

const apiData = {
    statsApiNHLBaseUrl,
    statsApiNhlSeasonStatsEndpoint,
    thisSeason,
    lastSeason,
    statsApiNhlTeamsSuffix,
    statsApiNhlTeamRoster
};

module.exports = apiData;
