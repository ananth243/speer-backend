const User = require("../models/User");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { createAccessToken } = require("../util/common");

require("dotenv").config();

let userAccessToken;

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DBURI);
  let id = (await User.findOne({ username: "user1" })).id;
  userAccessToken = await createAccessToken("user1", id);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/search", () => {
  it("Gets all records for a query", async () => {
    const res = await request(app)
      .get(`/api/search?q=Chennai`)
      .set("access_token", userAccessToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.notes.length).toBe(1)
  });
});
