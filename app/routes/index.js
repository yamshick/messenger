const getRoutes = require("./get-routes");
const postRoutes = require("./post-routes");
const putRoutes = require("./product-put-route");
const deleteRoutes = require("./product-delete-route");
const loadDatabase = require("../db/setup-database");
const initSocket = require('../socket/init-socket')

module.exports = function (app, db, io) {
  // create database in case it was not created yeat,
  // or update in case of migrations
  loadDatabase(db);

  // start routes
  getRoutes(app, db);
  postRoutes(app, db);
  putRoutes(app, db);
  deleteRoutes(app, db);

  // start sockets
  initSocket(io, db)
};
