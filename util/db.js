const mongoose = require("mongoose");
const User = require("../models/User");
const Note = require("../models/Note");
const { readFile } = require("fs/promises");
const { join } = require("path");

require("dotenv").config();

function populateDB() {
  mongoose.connect(process.env.TEST_DBURI).then(async () => {
    const user1 = new User({
      username: "user1",
      email: "test@example.com",
      password: "AStrongPwd@2024",
    });
    await user1.save();
    const user2 = new User({
      username: "user2",
      email: "test@example.com",
      password: "AStrongPwd@2024",
    });
    await user2.save();
    const mockData = await readFile(join(__dirname, "mock_notes.json"));
    let notes = JSON.parse(mockData).map((note) => {
      return { userId: user1.id, ...note };
    });
    await Note.insertMany(notes)
    mongoose.connection.close();
  });
}

function tearDownDB() {
  mongoose.connect(process.env.TEST_DBURI).then(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
    mongoose.connection.close();
  });
}

module.exports = { populateDB, tearDownDB };
