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
    app.post('/api/chat/', (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");

         const data = req.body;
         console.log({data})
         processChat(req, res, db);
         
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