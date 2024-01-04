const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DBURI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/auth/signup", () => {
  it("should return invalid fields", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ username: "testUser" });
    expect(res.statusCode).toBe(500);
  });
  it("should perform email validation successfully", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "testUser",
      email: "test",
      password: "AStrongPwd@2024",
    });
    expect(res.statusCode).toBe(500);
  });
  it("should perform password validation successfully", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "testUser",
      email: "test@example.com",
      password: "weakPwd",
    });
    expect(res.statusCode).toBe(500);
  });
  it("should fail to create same user again", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "user1",
      email: "test@example.com",
      password: "AStrongPwd@2024",
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("should return invalid fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "test" });
    expect(res.statusCode).toBe(500);
  });
  it("should return unknown user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testUser", password: "AStrongPwd@2024" });
    expect(res.statusCode).toBe(404);
  });
  it("should perform password validation successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "user1",
      password: "weakPwd",
    });
    expect(res.statusCode).toBe(400);
  });
  it("should create an access token successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "user1",
      password: "AStrongPwd@2024",
    });
    expect(res.statusCode).toBe(200);
  });
});
