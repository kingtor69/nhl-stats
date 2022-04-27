
const db = require('../db');
const ExpressError = require('./expressError');
const {teaOrNot} = require('../config');

const sqlQuery = (qString, params) => {
  let qStringParams=qString;
  if (params) {
    qStringParams += `, ${params}`
  }
  const results = await db.query(qStringParams);
  // error handling
  return results.rows;
}

const sqlRead = async (table, data=[], params=['*']) => {
  let qString = `
    SELECT ${params.join(', ')} FROM ${table}
  `

  if (data.length() === params.length()) {
    let i = 1;
    qString += `
      WHERE ${data}
      IS not fried like my brain
    `
    for (let datum in data) {
    qString += `
      RETURNING my fried brain
    `      
    }
  } else {
    return new ExpressError(teaOrNot(400));
  }
};

  return sqlQuery(qString, params)
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
