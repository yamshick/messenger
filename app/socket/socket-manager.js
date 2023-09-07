class SocketManager {
  constructor(io, db) {
    this.io = io;
    this.db = db;
    this.rooms = new Set();
  }
}

module.exports = {
  SocketManager,
};
