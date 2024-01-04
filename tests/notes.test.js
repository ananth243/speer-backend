const { createAccessToken } = require("../util/common");
const User = require("../models/User");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

let user1AccessToken, user2AccessToken;

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DBURI);
  let id = (await User.findOne({ username: "user1" })).id;
  user1AccessToken = await createAccessToken("user1", id);
  id = (await User.findOne({ username: "user2" })).id;
  user2AccessToken = await createAccessToken("user2", id);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/notes/", () => {
  it("Gets all notes for an authenticated user", async () => {
    const res = await request(app)
      .get("/api/notes")
      .set("access_token", user1AccessToken);
    expect(res.statusCode).toBe(200);
  });
  it("Get all notes for an unauthenticated user", async () => {
    const res = await request(app).get("/api/notes");
    expect(res.statusCode).toBe(500);
  });
});

describe("CRUD /api/notes", () => {
  let noteId;
  it("1. Should create a note", async () => {
    const res = await request(app)
      .post("/api/notes")
      .send({ title: "Test Note", description: "Note description" })
      .set("access_token", user1AccessToken);
    noteId = res.body.note._id;
    expect(res.statusCode).toBe(200);
  });

  it("2. Should update a note", async () => {
    let res = await request(app)
      .put(`/api/notes/${noteId}`)
      .send({ title: "Test Note", description: "Updated note description" })
      .set("access_token", user2AccessToken);
    expect(res.statusCode).toBe(400);
    res = await request(app)
      .put(`/api/notes/${noteId}`)
      .send({ title: "Test Note", description: "Updated note description" })
      .set("access_token", user1AccessToken);
    expect(res.statusCode).toBe(200);
  });

  it("3. Should get a note", async () => {
    const res = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("access_token", user1AccessToken);
    expect(res.statusCode).toBe(200);
  });

  it("4. Should share a note", async () => {
    let res = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("access_token", user2AccessToken);
    expect(res.statusCode).toBe(400);
    res = await request(app)
      .post(`/api/notes/${noteId}/share`)
      .send({ username: "user2" })
      .set("access_token", user1AccessToken);
    expect(res.statusCode).toBe(200);
    res = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("access_token", user2AccessToken);
    expect(res.statusCode).toBe(200);
  });

  it("5. Should delete a note", async () => {
    let res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("access_token", user2AccessToken);
    expect(res.statusCode).toBe(400);
    res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("access_token", user1AccessToken);
    expect(res.statusCode).toBe(200);
  });
});
