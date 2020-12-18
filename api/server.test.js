// Write your tests here


const request = require("supertest");
const server = require('./server')
const db = require('../data/dbConfig')
const User = require('./users/users-model')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})
test('sanity', () => {
  expect(true).toBe(true)
})
const user1 = {
  username: "user1",
  password: "pass1",
};
const user2 = {
  username:"user2",
  
};

describe("[POST] auth/register", () => {
  it("Valid info check", async () => {
    const res = await request(server)
    .post("/api/auth/register")
    .send(user1);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("password");
  });
  it("Invalid information check", async () => {
    const res = await request(server)
    .post("/api/auth/register")
    .send(user2);
    expect(res.body).toBe("username and password required");
  });
});

describe("[POST] auth/login", () => {
  it("Valid login check", async () => {
    await request(server)
    .post("/api/auth/register")
    .send(user1);
    const res = await request(server).post("/api/auth/login").send(user1);
    expect(res.body).toHaveProperty("token");
  });
  it("Invalid login check", async () => {
    const res = await request(server).post("/api/auth/login").send(user1);
    expect(res.body).toHaveProperty("message");
  });
});
