
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function createToken(username, admin=false) {
  let payload = {username, admin};
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = createToken;
