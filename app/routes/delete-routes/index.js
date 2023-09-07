module.exports = function (app, db) {
  app.delete("/api/user/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const user = req.body;

    updateUser(user, res, db);
  });

  app.delete("/api/chat/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const chat = req.body;

    deleteChat(chat, res, db);
  });
};

function updateUser(user, res, db) {
  const id = user.id;

  if (!id) {
    res.status(400).send("ID is mandatory");
  } else {
    const sql = `delete from Users where id = ?;`;
    const values = [id];

    db.serialize(function () {
      db.run(sql, values, function (err) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else res.send();
      });
    });
  }
}

function deleteChat(chat, res, db) {
  const id = chat.id;

  if (!id) {
    res.status(400).send("ID is mandatory");
  } else {
    const sql = `delete from Chats where id = ?;`;
    const values = [id];

    db.serialize(function () {
      db.run(sql, values, function (err) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else res.send();
      });
    });
  }
}
