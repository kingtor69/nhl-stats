
const express = require('express');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { 
  statsApiNHLBaseUrl,
  statsApiNhlSeasonStatsEndpoint,
  thisSeason,
  lastSeason,
  statsApiNhlTeamsSuffix,
  statsApiNhlTeamRoster
} = require('../apiData');

router.get('/', function(req, res, next) {
  return {'test':'one two one two'}
});

module.exports = router;
