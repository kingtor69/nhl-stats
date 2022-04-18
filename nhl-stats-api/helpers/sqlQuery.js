
const db = require('../db');
const ExpressError = require('../helpers/expressError');

const sqlQuery = async (sqlStr, params) => {
  const results = await db.query(sqlStr, params);
  // error handling
  return results.rows;
};

module.exports = sqlQuery;
