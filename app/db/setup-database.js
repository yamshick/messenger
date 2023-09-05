const fs = require('fs');
const chatSchema = fs.readFileSync('app/db/chat-schema.sql').toString();

module.exports = function(db) {
    db.serialize(function() {
        db.run(chatSchema);
    });
};
