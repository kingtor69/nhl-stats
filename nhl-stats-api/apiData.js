
const apiData = () => {
    const today = new Date();
    const startYear = today.getMonth() > 8 ? today.getYear() : today.getYear() - 1;
    const thisSeason = `{startYear}{startYear + 1}`;
    const lastSeason = `{startYear-1}{startYear}`;
    return {
        statsApiNHLBaseUrl:  "https://statsapi.web.nhl.com/",
        statsApiNhlSeasonStatsEndpoint: "/stats=statsSingleSeason&season=",
        thisSeason,
        lastSeason,
        statsApiNhlTeamsSuffix: 'f',
        // returns all teams or a team with ID added to URL
        statsApiNhlTeamRoster: '?expand=team.roster'
    };
};

export default apiData;
