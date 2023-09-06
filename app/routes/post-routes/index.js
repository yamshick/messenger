async function db_all(db, query, params){
    return new Promise(function(resolve,reject){
        db.all(query, params, function(err,rows){
           if(err){return reject(err);}
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
    app.post('/api/register/', (req, res) => {
        // res.setHeader("Access-Control-Allow-Origin", "*");

         const data = req.body;
         console.log('register', {data})
         processUser(req, res, db);
         
    //     if((data.constructor === Array))
    //        processProducts(req, res, db);
    //     else
    });

    app.post('/api/chat/', (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");

         const data = req.body;
         console.log({data})
         processUser(req, res, db);
         
    //     if((data.constructor === Array))
    //        processProducts(req, res, db);
    //     else
    });
};

function processProducts(req, res, db){
    for (var prod of req.body) {
        insertChat(prod, res, db);
    }
}

function processUser(req, res, db){
    validateRequest(req, res);
    validateRegistration(req.body, res, db);
    insertUser(req.body, res, db);
}

function processChat(req, res, db){
    validateRequest(req, res);
    insertChat(req.body, res, db);
}

function insertChat(chat, res, db){
	const {name, users: rawUsers} = chat
	const users = rawUsers.join(',') 
	const messages = '[]'

    var sql = `insert into Chats (name, users, messages) 
            VALUES 
            (?, ?, ?);`;

    var values = [name, users, messages];

    db.serialize(function () {
        db.run(sql, values, function (err) {
            if (err){
                console.error(err);
                res.status(500).send(err);
            }
                
            else
                res.send();
        });
    });
}

async function validateRegistration(user, res, db) {
	const {firstName, secondName, login, password} = user

        // let userExists = false;
        // TODO
        const validateUserSql = `select * from Users where login = ?`;
        // const result = await db.query(validateUserSql, [login]);
        const result = await db_all(db, validateUserSql, [login])
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
          
          console.log('__found', {result})
          if (result.length) {
            // userExists = false;
            res.setHeader("Access-Control-Allow-Origin", "*");
            // res.status(409).json({error: 'User with such login exists'})
            
            return res.status(409).send(JSON.stringify({error: 'User with such login exists'}));
          }
        }

function insertUser(user, res, db){
	const {firstName, secondName, login, password} = user

    const insertUserSql = `insert into Users (first_name, second_name, login, password) 
            VALUES 
            (?, ?, ?, ?);`;

    const values = [firstName,secondName || '', login, password];

    db.serialize(function () {
        db.run(insertUserSql, values, function (err) {
            if (err){
                console.error(err);
        res.setHeader("Access-Control-Allow-Origin", "*");
            return res.status(500).send(err);
                
            }
                
            else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(JSON.stringify({message: "User successfully registered"}));
            }
        });
    });
}

function validateRequest(req, res) {
	return;
	// TODO
    var fs = require('fs');
    var schema = JSON.parse(fs.readFileSync('app/data/product-schema.json', 'utf8'));

    var JaySchema = require('jayschema');
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