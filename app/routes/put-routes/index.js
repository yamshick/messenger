module.exports = function (app, db) {
    app.put("/api/user/", (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
  
      const data = req.body;
  
      processData(req, res, db);
    });
  };
    
  function processData(req, res, db) {
    // validateRequest(req, res);
    updateUser(req.body, res, db);
  }
  
  function checkIfExist() {
    // TODO: check business
  }
  
  function updateUser(user, res, db) {
    checkIfExist();

    const {id, firstName, secondName, login, password, role} = user;
  
    const sql = `update Users
              set firstName = ?, secondName = ?, login = ?, password = ?, role = ?
              where id = ?;`;
  
    const values = [firstName, secondName, login, password, role, id];
  
    db.serialize(function () {
      db.run(sql, values, function (err) {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else res.send();
      });
    });
  }
  
  function validateRequest(req, res) {
    var fs = require("fs");
    var schema = JSON.parse(
      fs.readFileSync("app/data/product-schema-update.json", "utf8")
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
  }
  