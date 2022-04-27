
process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// testing sqlCrud using `teams` table

beforeEach(async () => {
  let sampleTeams = [
    ["Detroit", "Red Wings"],
    ["Chicago", "Blackhawks"],
    ["Toronto", "Maple Leafs"],
    ["Montréal", "Canadiens"]
    ["Boston", "Bruins"],
    ["New York", "Rangers"]
  ];

  for (let team of sampleTeams) {
    await db.query(
      `INSERT INTO teams
        (city, mascot) 
        VALUES ($1, $2)`,
      team
    );
  }
});

describe('does beforeEach even work?', () => {
  it('should pass this stupid test', () => {
    expect(true).toBe(true);
  });

  it('should have 6 teams in the test database', async () => {
    const response = await db.query(
      `SELECT username FROM teams`
    );
    const teams = response.rows;
    expect(teams.length).toBe(6);
  });
});

afterEach(async () => {
  await db.query("DELETE FROM teams");
});

afterAll(() => {
  db.end();
});
