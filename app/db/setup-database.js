const fs = require("fs");
// const chatSchema = fs.readFileSync('app/db/chat-schema.sql').toString();
const schemasFileNames = [
  "app/db/chat-schema.sql",
  "app/db/users-schema.sql",
  "app/db/roles-schema.sql",
  "app/db/init-admin-user-schema.sql",
  "app/db/init-roles-schema.sql",
];

const schemas = (() => {
  const res = [];
  try {
    for (let fName of schemasFileNames) {
      res.push(fs.readFileSync(fName).toString());
    }
  } catch (e) {
    console.error("db schemas init error", e);
    return [];
  }

  return res;
})();

module.exports = function (db) {
  try {
    for (let schema of schemas) {
      try {
        db.serialize(function () {
          db.run(schema);
        });
      } catch (e) {
        // console.error('error: ', schema)
        throw new Error(schema);
      }
    }
  } catch (e) {
    console.error(e);
  }
};
