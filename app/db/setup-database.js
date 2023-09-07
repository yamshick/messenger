const fs = require("fs");
// const chatSchema = fs.readFileSync('app/db/chat-schema.sql').toString();

// TODO: common function
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

const schemasFileNames = [
  "app/db/chat-schema.sql",
  "app/db/users-schema.sql",
  "app/db/roles-schema.sql",
  // "app/db/init-admin-user-schema.sql",
  // "app/db/init-roles-schema.sql",
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

module.exports = async function (db) {
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

  // init admin
  try {
    const selectAdminSql = `select * from Users where login = "admin"`
    const adminUsers = await db_all(db, selectAdminSql);
    if (!adminUsers.length) {
      const insertAdminSql = `
      insert into Users (firstName, secondName, login, password, role) 
            VALUES ("admin", "admin", "admin", "admin", "admin")
      `
      await db_all(db, insertAdminSql);
    }
  } catch( e) {
    console.error(e)
  }

  try {
    const insertRoleIfNotExists = async (roleName, priority) => {
      const selectRoleSql = `select * from Roles where name = "${roleName}"`
      const roles = await db_all(db, selectRoleSql);
      if (!roles.length) {
        const insertRoleSql = `
        insert into Roles (name, priority) 
              VALUES ("${roleName}", "${priority}")
        `
        await db_all(db, insertRoleSql);
      }  
    }

    await insertRoleIfNotExists('admin', 1)
    await insertRoleIfNotExists('superuser', 2)
    await insertRoleIfNotExists('user', 3)

  } catch( e) {
    console.error(e)
  }
};
