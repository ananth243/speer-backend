const { connect } = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 8080;

require("dotenv").config();

app.listen(PORT, async () => {
  console.log(`Server listening to port: ${PORT}`);
  await connect(process.env.DBURI);
  console.log("Connected to DB");
});
