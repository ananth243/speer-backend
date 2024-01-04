const { searchNotes } = require("../../controllers/search.controller");
const { authenticateUser } = require("../../middleware/authMiddleware");
const router = require("express").Router();

// Authentication middleware
router.use(authenticateUser);

router.get("/", searchNotes);

module.exports = router;
