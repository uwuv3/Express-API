const express = require("express");
const flash = require("connect-flash");
const app = express();
const path = require("path");
require("./routes/main.js")(app);
require("./routes/kontrolurl.js")(app);
require("./routes/lyrics.js")(app);
require("./routes/doviz.js")(app);
require("./routes/search.js")(app);
require("./routes/discordInteraction.js")(app)
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "pages"));
app.use(flash());

const connection = app.listen(5000, () => {
  console.log(`App Running On http://localhost:${connection.address().port}`);
});
module.exports = app;
