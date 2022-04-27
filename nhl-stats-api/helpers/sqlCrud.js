
const db = require('../db');
const ExpressError = require('./expressError');

const sqlQuery (qString, params) => {
  const 
}
const sqlRead = async (data, params) => {
  const results = await db.query(data, params);
  // error handling
  return results.rows;
};

const sqlPatch = (table, data, pKeyName, pKey) => {
  let i = 1;
  let cols = [];

  for (let key in data) {
    if (key.startsWith("_")) {
      delete data[key];
    };
  };

  for (let col in items) {
    col.push(`${col}=$${i}`);
    i++;
  };

  let query = `UPDATE ${table} 
    SET ${cols.join(', ')} 
    WHERE ${pKeyName}=$${i} 
    RETURNING *`;
  let values = Object.values(data);
  values.push(pKey);

  return {query, values};
};

module.exports = {
  sqlCreate,
  sqlRead,
  sqlUpdate,
  sqlDelete
}
