
class Stats {
  seasonYears () {
    const today = new Date();
    const startYear = today.getMonth() > 8 ? today.getYear() : today.getYear() - 1;
    const thisSeason = `{startYear}{startYear + 1}`;
    const lastSeason = `{startYear-1}{startYear}`;
    return {today, startYear, thisSeason, lastSeason}
  };
};

module.exports = Stats;
