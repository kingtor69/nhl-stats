
process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// tokens for our sample users
const tokens = { guest: createToken( 'guest', false ) };

beforeEach(async () => {
  async function _pwd(password) {
    return await bcrypt.hash(password, 1);
  }

  let sampleUsers = [
    ["u1", await _pwd("pwd1"), "email1", "first1", "last1", "bio1", false],
    ["u2", await _pwd("pwd2"), "email2", "first2", "last2", "bio2", false],
    ["u3", await _pwd("pwd3"), "email3", "first3", "last3", "bio3", true]
  ];

  for (let user of sampleUsers) {
    await db.query(
      `INSERT INTO users
        (username, password, email, first_name, last_name, bio, is_admin) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      user
    );
    tokens[user[0]] = createToken(user[0], user[6]);
  }
});

describe('does beforeEach even work?', () => {
  it('should pass this stupid test', () => {
    expect(true).toBe(true);
  });

  it('should have 3 users in the test database', async () => {
    const response = await db.query(
      `SELECT username FROM users`
    );
    const users = response.rows;
    expect(users.length).toBe(3);
  });
});

describe("POST /auth/register", function() {
  it("should allow a new user to register", async () => {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new_user",
        password: "new_password",
        email: "new@newuser.com",
        first_name: "new_first",
        last_name: "new_last",
        bio: "bio"
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(resp.body.token, SECRET_KEY);
    expect(username).toBe("new_user");
    expect(admin).toBe(false);
  });

  it("should not allow a user to register with an existing username", async () => {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "u1",
        password: "potato",
        email: "kartoffel@pub.com",
        first_name: "Doppel",
        last_name: "Ganger",
        bio: "I like potatoes."
      });
    expect(resp.statusCode).toBe(401);
  });  
});

describe("POST /auth/login", () => {
  it("should return a token for a correct username/password login attempt", async () => {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "pwd1"
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.token).toBeTruthy();
  });

  it("should return 401 and *no* token when passed incorrect credentials", async () => {
    const wrongUser = await request(app)
      .post("/auth/login")
      .send({
        username: "wrong",
        password: "pw1"
      });
    expect(wrongUser.statusCode).toBe(401);
    expect(wrongUser.body.token).toBeFalsy();
    const wrongPass = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "wrong"
      });
    expect(wrongPass.statusCode).toBe(401);
    expect(wrongPass.body.token).toBeFalsy();
  });
});

describe("GET /users", function() {
  it("should deny access if no token provided", async function() {
    const response = await request(app)
      .get("/users");
    expect(response.statusCode).toBe(401);
  });

  it("should return a list of usernames only for a 'guest' get /users request", async () => {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.guest })
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3);
    expect(Object.keys(response.body.users[0])).toEqual(expect.arrayContaining(['username']));
    expect(Object.keys(response.body.users[0])).toEqual(expect.not.arrayContaining(['email']));
    expect(Object.keys(response.body.users[0])).toEqual(expect.not.arrayContaining(['first_name']));
    expect(Object.keys(response.body.users[0])).toEqual(expect.not.arrayContaining(['last_name']));
  });

  it("should list all users with appropriate data for any logged-in user", async () => {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3);
    expect(Object.keys(response.body.users[0])).toEqual(expect.arrayContaining(['username', 'email']));
    expect(Object.keys(response.body.users[0])).not.toEqual(expect.arrayContaining(['is_admin']));
  });

  it("should list all users with appropriate data for logged-in *admin* user", async () => {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3);
    expect(Object.keys(response.body.users[0]).toEqual(expect.arrayContaining(['username', 'email', 'is_admin'])));
  });

});

describe("GET /users/[username]", () => {
  it("should deny access if no token provided", async () => {
    const response = await request(app).get("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  it("should return data on u1 TO u1", async () => {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "first1",
      last_name: "last1",
      email: "email1",
      bio: "bio1"
    });
  });

  it("should return data on u1 TO u3 (admin)", async () => {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u3 });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      email: "email1",
      first_name: "first1",
      last_name: "last1",
      bio: "bio1"
    });
  });

  it("should return 404 for bad username", async() => {
    const response = await request(app)
      .get("/users/nope")
      .send({ _token: tokens.u3 });
    expect(response.statusCode).toBe(404);
  });

  it("should 401 u1's data to u2", async() => {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u2 });
    expect(response.statusCode).toBe(401);
  });

  it("should deny a fraudulent token", async () => {
    const bogusToken = {
      header: "who cares?",
      payload: {
        username: "u1",
        admin: true
      },
      signature: "somethingthatwillastotmatch"
    };
    const response = await request(app)
      .get("/users/u2")
      .send({ _token: bogusToken });
    expect(response.statusCode).toBe(401);
  });
});

describe("PATCH /users/[username]", function() {
  it("should deny access if no token provided", async function() {
    const response = await request(app).patch("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  it("should deny access if not admin/right user", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u2 }); // wrong user!
    expect(response.statusCode).toBe(401);
  });

  it("should patch data if admin", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u3, first_name: "new-first1" }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-first1",
      last_name: "last1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });

  it("should disallowing patching not-allowed-fields", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, admin: true });
    expect(response.statusCode).toBe(401);
  });

  it("should return 404 if cannot find", async function() {
    const response = await request(app)
      .patch("/users/not-a-user")
      .send({ _token: tokens.u3, first_name: "new-first" }); // u3 is admin
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /users/[username]", function() {
  it("should deny access if no token provided", async function() {
    const response = await request(app).delete("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  it("should deny access if not admin", async function() {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(401);
  });

  it("should allow if admin", async function() {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u3 }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "deleted" });
  });
});

afterEach(async () => {
  await db.query("DELETE FROM users");
});

afterAll(() => {
  db.end();
});
