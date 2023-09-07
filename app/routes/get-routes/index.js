module.exports = function (app, db) {
  app.get("/api/users/:loginPredicate", (req, res) => {
    const predicate = req.params.loginPredicate;
    console.log({ predicate });
    if (!predicate) {
      return res.json([]);
    }
    const sql = `SELECT * FROM Users WHERE LOGIN LIKE '${predicate}%'`;
    processData(res, sql);
    // processData(res, "SELECT * FROM Chats where id == "+req.params.userId);
  });

  app.get("/api/chat", (req, res) => {
    const { userIds } = req.query;
    const sortedUserIds = userIds
      .split(",")
      .map(Number)
      .sort((a, b) => a - b)
      .join(",");
    console.log("/api/chat", { userIds, sortedUserIds });
    processData(res, `SELECT * FROM Chats where USERS == '${sortedUserIds}'`);

    // processData(res, `
    //   SELECT * FROM Chats
    //   WHERE
    //     USERS LIKE '%,${userId}%' OR
    //     USERS LIKE '${userId},%'
    //   `);
    // return res.send();
    // processData(res, "SELECT * FROM Chats where id == "+req.params.userId);
  });

  app.get("/api/chats/:userId", (req, res) => {
    const userId = req.params.userId;
    processData(
      res,
      `
      SELECT * FROM Chats 
      WHERE 
        USERS LIKE '%,${userId}%' OR
        USERS LIKE '${userId},%'
      `
    );
    // processData(res, "SELECT * FROM Chats where id == "+req.params.userId);
  });

  // Load products by ID: http://localhost:4300/api/product/id/$id
  // example: http://localhost:4300/api/product/id/15
  app.get("/api/chat/id/", (req, res) => {
    const chatId = req.query.chatId
    processData(res, "SELECT * FROM chats where id == " + chatId);
  });

  // Load products by attribute: http://localhost:4300/api/product/$attribute/$name
  // example: http://localhost:4300/api/product/price/24
  //          http://localhost:4300/api/product/name/Suntone
  // $attribute = ['name', 'price', 'currency', 'description']*
  // * this is not checked values, wrong parameters will return in a DB error.
  app.get("/api/product/:attribute/:name", (req, res) => {
    processData(
      res,
      "SELECT * FROM products where " +
        req.params.attribute +
        " = '" +
        req.params.name +
        "'"
    );
  });

  // Load all products: http://localhost:4300/api/product/
  app.get("/api/product", (req, res) => {
    processData(res, "SELECT * FROM products");
  });

  // Load products: http://localhost:4300/api/product/sort/$attribute
  // example: http://localhost:4300/api/product/sort/price
  //          http://localhost:4300/api/product/sort/name
  // $attribute = ['name', 'price', 'currency', 'description']*
  app.get("/api/product/sort/:way", (req, res) => {
    processData(res, "SELECT * FROM products order by " + req.params.way);
  });

  // Load products: http://localhost:4300/api/product/sort/$direction/$attribute
  // example: http://localhost:4300/api/product/sort/asc/price
  //          http://localhost:4300/api/product/sort/desc/price
  // $attribute = ['name', 'price', 'currency', 'description']*
  // $direction [ASC or DESC]C]*
  // * the direction is checked and when wrong will return a 401 business error.
  app.get("/api/product/sort/:direction/:way", (req, res) => {
    var way = req.params.way;
    var direction = req.params.direction;

    if (direction !== "asc" && direction !== "desc") {
      res.status(404).send("Sorting direction invalid!");
    }

    processData(
      res,
      "SELECT * FROM products order by " + way + " " + direction
    );
  });

  function processData(res, sql, emptyResponse) {
    db.serialize(function () {
      db.all(sql, function (err, rows) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else sendData(res, rows, err);
      });
    });
  }

  function sendData(res, data, err) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    console.log({ data });
    if (data) {
      res.send(data);
    } else {
      res.status(404).send("Not found");
    }
  }
};
