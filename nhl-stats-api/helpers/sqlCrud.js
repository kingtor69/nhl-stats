
const db = require('../db');
const ExpressError = require('./expressError');
const {teaOrNot} = require('../config');

const sqlQuery = async (qString, params) => {
  let qStringParams=qString;
  if (params) {
    qStringParams += `, ${params}`
  }
  const results = await db.query(qStringParams);
  // error handling
  return results.rows;
}

const sqlCreate = (table, data=[], params=[]) => {
  try {
    const keys = [];
    for (let i=1; i<=data.length; i++) {
      keys.append(`$${i}`);
    };
    const qString = `
      INSERT INTO ${table}
      (${params.join(', ')})
      VALUES (${keys.join(', ')})
    `;

    return sqlQuery(qString, data);
  } catch (err) {
    return err
  };

const sqlRead = (table, data=[], params=['*']) => {

  try {
    let qString = `
    SELECT ${params.join(', ')} FROM ${table}
  `;
    if (data.length === params.length) {
      const keys=[]
      for (let i=1; i<=params.length; i++) {
        keys.append(`$${i}`)
      };
      qString += `
        WHERE ${keys.join(', ')}
      ` 
    }

    return sqlQuery(qString, data);
  } catch (err) {
    return new ExpressError(teaOrNot(err.statusCode), err.message);
  }
};

const sqlUpdate = (table, data, pKeyName, pKey) => {
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

  return sqlQuery(query, values);
};

const sqlDelete = (table, pKeyName, pKey) => {
  return sqlQuery(`
    DELETE FROM ${table}
    WHERE ${pKeyName} = ${pKey}
  `);
};

module.exports = {
  sqlCreate,
  sqlRead,
  sqlUpdate,
  sqlDelete
}
