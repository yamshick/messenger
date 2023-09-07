const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`));

const io = require("socket.io")(server);

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("app/db/sqlite.db");

require("./app/routes")(app, db, io);

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json());

// app.use(express.json());
// app.use(express.urlencoded());

app.use(
  express.json({
    type: "*/*", // optional, only if you want to be sure that everything is parsed as JSON. Wouldn't recommend
  })
);
app.use(express.urlencoded());