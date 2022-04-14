
const express = require('express');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { 
  statsApiNHLBaseUrl,
  statsApiNhlSeasonStatsEndpoint,
  statsApiNhlTeamsSuffix,
  statsApiNhlTeamRoster
} = require('../config');
const {
  thisSeason,
  lastSeason
} = require('../models/stats');

router.get('/', function(req, res, next) {
  return {'test':'one two one two'}
});

module.exports = router;
