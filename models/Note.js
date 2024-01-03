const { Schema, model } = require("mongoose");

const noteModel = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 3
  },
  description: {
    type: String,
    required: true,
    minLength: 10
  },
  userId: {
    type: String,
    ref: "user",
    required: true,
  },
});

noteModel.index({ title: "text", description: "text" });
const Note = model("note", noteModel);

module.exports = Note;
