const getRoutes = require('./get-routes');
const postRoutes = require('./post-routes');
const putRoutes = require('./product-put-route');
const deleteRoutes = require('./product-delete-route');
const loadDatabase = require('../db/setup-database');

module.exports = function (app, db) {

  // create database in case it was not created yeat, 
  // or update in case of migrations
  loadDatabase(db);

  // start routes
  getRoutes(app, db);
  postRoutes(app, db);
  putRoutes(app, db);
  deleteRoutes(app, db);

};
