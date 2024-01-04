const Note = require("../models/Note");
const User = require("../models/User");
const Share = require("../models/Share");
const ServerError = require("../errors/ServerError");

module.exports.getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    return res.json({ notes });
  } catch (error) {
    next(error);
  }
};

module.exports.getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (note.userId != req.userId) {
      // Check if shared with user
      const record = await Share.findOne({ userId: req.userId, noteId: id });
      if (!record) throw new ServerError(400, "Not authorized to view note");
    }
    return res.json({ note });
  } catch (error) {
    next(error);
  }
};

module.exports.createNote = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;
    const note = new Note({ title, description, userId });
    await note.save();
    return res.json({ note });
  } catch (error) {
    next(error);
  }
};

module.exports.updateNote = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title, description }
    );
    if (!note)
      throw new ServerError(
        400,
        "This note does not exist or you are not authorized to modify it"
      );
    return res.json({ note });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, userId: req.userId });
    if (!note)
      throw new ServerError(
        400,
        "This note does not exist or you are not authorized to modify it"
      );
    await Share.deleteMany({ noteId: id });
    return res.json({ message: `Note ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};

module.exports.shareNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) throw new ServerError(404, `Username ${username} not found`);
    const record = new Share({ userId: user.id, noteId: id });
    await record.save();
    return res.json({ message: `Shared with ${username} successfully: ${id}` });
  } catch (error) {
    next(error);
  }
};
