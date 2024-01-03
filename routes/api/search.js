const { searchNotes } = require("../../controllers/search.controller");
const { authenticateUser } = require("../../middleware/authMiddleware");
const router = require("express").Router();

// Auth middleware
router.use(authenticateUser);

router.post("/", searchNotes);

module.exports = router;
