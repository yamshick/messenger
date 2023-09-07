const { userRoles } = require("../../constants");

async function db_all(db, query, params) {
  return new Promise(function (resolve, reject) {
    db.all(query, params, function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = function (app, db) {
  // Add new product
  // http://localhost:4300/api/product
  // Sending a JSON body:
  // {
  //     "name": "ExampleProductName",
  //     "description": "Example product description",
  //     "price": 2.00,
  //     "currency": "EUR"
  // }

  // or an array of products:
  // [
  //     {...},{...}
  // ]
  app.post("/api/login/", (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");

    const data = req.body;
    console.log("login", { data });
    processLogin(req, res, db);

    //     if((data.constructor === Array))
    //        processProducts(req, res, db);
    //     else
  });

  app.post("/api/register/", (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");

    const data = req.body;
    console.log("register", { data });
    processUser(req, res, db);

    //     if((data.constructor === Array))
    //        processProducts(req, res, db);
    //     else
  });

  app.post("/api/chat/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const data = req.body;
    console.log("/api/chat/", { data });
    insertChat(req, res, db);
  });

  // app.post("/api/chat/add", (req, res) => {
  //   res.setHeader("Access-Control-Allow-Origin", "*");

  //   const data = req.body;
  //   console.log({ data });
  //   // processUser(req, res, db);

  //   //     if((data.constructor === Array))
  //   //        processProducts(req, res, db);
  //   //     else
  // });
};

function processProducts(req, res, db) {
  for (var prod of req.body) {
    insertChat(prod, res, db);
  }
}

function processLogin(req, res, db) {
  validateRequest(req, res);
  loginUser(req.body, res, db);
}

function processUser(req, res, db) {
  validateRequest(req, res);
  validateRegistration(req.body, res, db);
  insertUser(req.body, res, db);
}

function processChat(req, res, db) {
  validateRequest(req, res);
  insertChat(req.body, res, db);
}

function insertChat(req, res, db) {
  const { name, userIds: rawUsers } = req.body;
  console.log('inserting chat', {
    name,
    rawUsers,
    // chat
  });
  const users = rawUsers.join(",");
  const messages = "[]";

  const sql = `insert into Chats (name, users, messages) 
            VALUES 
            (?, ?, ?);`;

  const values = [name, users, messages];

  const selectSql = `select * from Chats 
  where name == '${name}' and
  users == '${users}' and 
  messages == '${messages}'
  `;
  // does not retrieve any data
  db.serialize(function () {
    db.run(sql, values, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      }
    }).all(selectSql, function (err, rows) {
      // if (!rows.length) {
      //   return res.status(200).send(JSON.stringify({data: null}));
      // }

      // if (rows.length > 1) {
      //   const error = new Error('not unique value in db')
      //   console.error(errerror);
      //   return res.status(500).send(error?.toString());
      // }

      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        // const oneRow = rows.length ? rows[0] : JSON.stringify({data: null})
        sendData(res, rows, err);
      }
    });
  });
}

async function validateRegistration(user, res, db) {
  const { firstName, secondName, login, password } = user;

  // let userExists = false;
  // TODO
  const validateUserSql = `select * from Users where login = ?`;
  // const result = await db.query(validateUserSql, [login]);
  const result = await db_all(db, validateUserSql, [login]);
  // const rows = await db.all(validateUserSql, [login], (err, rows) => {
  //     if (err){
  //         console.error(err);
  //         return res.status(500).send(err);
  //         return;
  //     }

  //     // rows.forEach((row) => {
  //     //   console.log('__found: ', {row});
  //     // });

  //     // if (rows.length) {
  //     //     userExists = true;
  //     // }
  //   });

  console.log("__found on registration", { result });
  if (result.length) {
    // userExists = false;
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.status(409).json({error: 'User with such login exists'})

    return res
      .status(409)
      .send(JSON.stringify({ error: "User with such login exists" }));
  }
}

async function loginUser(data, res, db) {
  const { login, password } = data;

  const sql = `select * from Users where login = ?`;
  const users = await db_all(db, sql, [login]);
  const user = users?.[0] || null;

  console.log("__found on login", { users });
  if (!user) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(403).json({ error: "User with such login doesnot exist" });
    return res.send();
  } else if (user.login === login && user.password !== password) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(403).json({ error: "Wrong password" });
    return res.send();
  } else if (user.login === login && user.password === password) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res
      .json({
        user: {
          id: user.id,
          name: user.firstName,
          login: user.login,
          role: user.role,
        },
        message: "Logged in successfully",
      })
      .send();
  }
}

function insertUser(user, res, db) {
  const { firstName, secondName, login, password } = user;

  const insertUserSql = `insert into Users (firstName, secondName, login, password, role) 
            VALUES 
            (?, ?, ?, ?, ?);`;

  const values = [firstName, secondName || "", login, password, userRoles.USER];

  db.serialize(function () {
    db.run(insertUserSql, values, function (err) {
      if (err) {
        console.error(err);
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(500).send(err);
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(
          JSON.stringify({ message: "User successfully registered" })
        );
      }
    });
  });
}

function validateRequest(req, res) {
  return;
  // TODO
  var fs = require("fs");
  var schema = JSON.parse(
    fs.readFileSync("app/data/product-schema.json", "utf8")
  );

  var JaySchema = require("jayschema");
  var js = new JaySchema();
  var instance = req.body;

  js.validate(instance, schema, function (errs) {
    if (errs) {
      console.error(errs);
      res.status(400).send(errs);
    }
  });

  if (req.body.id) {
    res.status(400).send("ID cannot be submmited");
  }
}

function sendData(res, data, err, emptyResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  console.log({ data });
  if (data && !data.length) {
    res.send(emptyResponse);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404).send("Not found");
  }
}
