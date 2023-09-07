class SocketManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Set();
  }
}

module.exports = {
  SocketManager,
};
