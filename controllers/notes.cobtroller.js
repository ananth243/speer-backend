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
      // Check if shared
      const record = await Share.findOne({ userId: req.userId, noteId: id });
      if (!record) throw new ServerError(400, "Note not available");
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
    return res.json({
      message: `Note ${note.id} created successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateNote = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const note = await Note.findOneAndUpdate({_id: id, userId: req.userId}, {title, description})
    if (!note)
      throw new ServerError(400, "Operation not allowed");
    return res.json({ message: `Note ${id} updated successfully` });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({_id: id, userId: req.userId})
    console.log(note)
    if (!note)
      throw new ServerError(400, "Operation not allowed");
    return res.json({ message: `Note ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};

module.exports.shareNote = async (req, res, next) => {
  const { id } = req.params;
  const { username } = req.body;
  const user = await User.findOne({ username });
  if(!user) throw new ServerError(404, "User not found")
  const record = new Share({ userId: user.id, noteId: id });
  await record.save();
  return res.json({ message: `Shared with ${username} successfully: ${id}` });
};
