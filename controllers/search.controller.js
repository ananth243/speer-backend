const Note = require("../models/Note");

module.exports.searchNotes = async (req, res) => {
  const { q } = req.query;
  const notes = await Note.find({
    $text: { $search: q },
    userId: req.userId,
  }).limit(10);
  return res, json({ notes });
};
