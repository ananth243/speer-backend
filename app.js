const app = require("express")();
const { rateLimit } = require("express-rate-limit");
const authRouter = require("./routes/api/auth");
const notesRouter = require("./routes/api/notes");
const searchRouter = require("./routes/api/search");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
});

app.use(limiter);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/search", searchRouter);

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
