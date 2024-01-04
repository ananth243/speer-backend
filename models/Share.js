const { Schema, model } = require("mongoose");

const shareModel = new Schema({
  noteId: {
    type: String,
    ref: "note",
    required: true,
  },
  userId: {
    type: String,
    ref: "user",
    required: true,
  },
});

// Combination of two fields should be unique
shareModel.index({ userId: 1, noteId: 1 }, { unique: true });
const Share = model("share", shareModel);

module.exports = Share;
