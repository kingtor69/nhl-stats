
const sqlUpdate = (table, data, pKeyName, pKey) {
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

module.exports = sqlUpdate;
