
const bcrypt = require('bcrypt');
const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlUpdate = require('../helpers/sqlUpdate');
const { BCRYPT_WORK_FACTOR, teaOrNot } = require("../config");

class User {

  static async register({username, email, password, first_name, last_name, bio}) {
    const duplicateCheck = await db.query(
      `SELECT username
        FROM users
        WHERE username = $1`,
      [username]
    );
    if (duplicateCheck.rows[0]) {
      throw new ExpressError(
        `Username '${username}' is already in use. Please pick another.`, teaOrNot(401)
      );
    };
      
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
        (username, password, email, first_name, last_name, bio)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, password, email, first_name, last_name, bio`,
        [
          username,
          hashedPassword,
          email,
          first_name,
          last_name,
          bio
        ]
      );

      return result.rows[0];
  };

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
              password,
              is_admin
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = results.rows[0];
    if (!user) {
      throw new ExpressError ('invalid username/password combination.', teaOrNot(401));
    };
    const comparison = await bcrypt.compare(password, user.password);
    if (!comparison) {
      throw new ExpressError ('invalid username/password combination.', teaOrNot(401));
    };

    return user;
  };

  static async getAll() {
    const result = await db.query(
      `SELECT username,
              first_name,
              last_name
        FROM users
        ORDER BY username`
    );

    return result.rows;
  };

  static async get(username) {
    const result = await db.query(
      `SELECT username,
              email,
              first_name,
              last_name,
              bio
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      throw new ExpressError('No user found', teaOrNot(404));
    };

    return user;
  };

  static async update(username, data) {
    let { query, values } = sqlUpdate(
      'users',
      data,
      'username',
      username
    );

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError('No user found', teaOrNot(404));
    };

    return user;
  };

  static async delete(username) {
    const result = await db.query(
      `DELETE FROM users
        WHERE username = $1
        RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      throw new ExpressError('No user found', teaOrNot(404));
    };

    return true;
  };
};

module.exports = User;
