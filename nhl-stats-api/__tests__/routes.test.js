// Set ENV VAR to test before we load anything, so our app's config will use
// testing settings

process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// tokens for our sample users
const tokens = {};

/** before each test, insert u1, u2, and u3  [u3 is admin] */

beforeEach(async function() {
  async function _pwd(password) {
    return await bcrypt.hash(password, 1);
  }

  let sampleUsers = [
    ["u1", "fn1", "ln1", "email1", "phone1", await _pwd("pwd1"), false],
    ["u2", "fn2", "ln2", "email2", "phone2", await _pwd("pwd2"), false],
    ["u3", "fn3", "ln3", "email3", "phone3", await _pwd("pwd3"), true]
  ];

  for (let user of sampleUsers) {
    await db.query(
      `INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      user
    );
    tokens[user[0]] = createToken(user[0], user[6]);
  }
});

describe("POST /auth/register", function() {
  test("should allow a user to register in", async function() {
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "new_user",
        password: "new_password",
        first_name: "new_first",
        last_name: "new_last",
        email: "new@newuser.com",
        phone: "1233211221"
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ token: expect.any(String) });

    let { username, admin } = jwt.verify(response.body.token, SECRET_KEY);
    expect(username).toBe("new_user");
    expect(admin).toBe(false);
  });

  // tests bug #1
  test("should not allow a user to register with an existing username", async () => {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "u1",
        password: "potato",
        first_name: "Double",
        last_name: "Doppel",
        email: "kartoffel@pub.com",
        phone: "14933139480982"
      });
    expect(resp.statusCode).toBe(401);
  });  
});

describe("POST /auth/login", () => {
  test("should return a token for a correct username/password login attempt", async () => {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        username: "u1",
        password: "pwd1"
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.token).toBeTruthy();
  });

  // tests bug #2
  test("should return 401 and *no* token when passed incorrect credentials", async () => {
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
  test("should deny access if no token provided", async function() {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(401);
  });

  test("should list all users", async function() {
    const response = await request(app)
      .get("/users")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.users.length).toBe(3);
  });
});

describe("GET /users/[username]", function() {
  test("should deny access if no token provided", async function() {
    const response = await request(app).get("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should return data on u1 TO u1", async function() {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1"
    });
  });

  test("should return data on u1 TO u3 (admin)", async function() {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u3 });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1"
    });
  });

  // tests bug #3
  test("should return 404 for bad username", async() => {
    const response = await request(app)
      .get("/users/nope")
      .send({ _token: tokens.u3 });
    expect(response.statusCode).toBe(404);
  });

  // tests bug #4
  test("should 401 u1's data to u2", async() => {
    const response = await request(app)
      .get("/users/u1")
      .send({ _token: tokens.u2 });
    expect(response.statusCode).toBe(401);
  });

  // this is to fix bug #5
  test("fradulent token should be denied", async () => {
    const bogusToken = {
      header: "who cares?",
      payload: {
        username: "u1",
        admin: true
      },
      signature: "somethingthatwillnotmatch"
    };
    const response = await request(app)
      .get("/users/u2")
      .send({ _token: bogusToken });
    expect(response.statusCode).toBe(401);
  });
});

describe("PATCH /users/[username]", function() {
  test("should deny access if no token provided", async function() {
    const response = await request(app).patch("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should deny access if not admin/right user", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u2 }); // wrong user!
    expect(response.statusCode).toBe(401);
  });

  test("should patch data if admin", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u3, first_name: "new-fn1" }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual({
      username: "u1",
      first_name: "new-fn1",
      last_name: "ln1",
      email: "email1",
      phone: "phone1",
      admin: false,
      password: expect.any(String)
    });
  });

  test("should disallowing patching not-allowed-fields", async function() {
    const response = await request(app)
      .patch("/users/u1")
      .send({ _token: tokens.u1, admin: true });
    expect(response.statusCode).toBe(401);
  });

  test("should return 404 if cannot find", async function() {
    const response = await request(app)
      .patch("/users/not-a-user")
      .send({ _token: tokens.u3, first_name: "new-fn" }); // u3 is admin
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /users/[username]", function() {
  test("should deny access if no token provided", async function() {
    const response = await request(app).delete("/users/u1");
    expect(response.statusCode).toBe(401);
  });

  test("should deny access if not admin", async function() {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u1 });
    expect(response.statusCode).toBe(401);
  });

  test("should allow if admin", async function() {
    const response = await request(app)
      .delete("/users/u1")
      .send({ _token: tokens.u3 }); // u3 is admin
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "deleted" });
  });
});

afterEach(async function() {
  await db.query("DELETE FROM users");
});

afterAll(function() {
  db.end();
});
