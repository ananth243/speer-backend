const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
} = require("../../controllers/notes.cobtroller");
const { authenticateUser } = require("../../middleware/authMiddleware");
const router = require("express").Router();

// Auth middleware
router.use(authenticateUser);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/share", shareNote);

module.exports = router;
