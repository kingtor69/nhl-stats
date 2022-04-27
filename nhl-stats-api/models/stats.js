
class Stats {
  constructor() {
    this.today = new Date();
    this.startYear = today.getMonth() > 8 ? today.getYear() : today.getYear() - 1;
    this.thisSeason = `{startYear}{startYear + 1}`;
    this.lastSeason = `{startYear-1}{startYear}`;
  };

  
};

module.exports = Stats;
