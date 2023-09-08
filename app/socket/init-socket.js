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

let socketsConected = new Set();

module.exports = function (io, db) {
  io.sockets.on("connection", function (socket) {
    onSocketConnection({ io, db, socket });
  });
};

function onSocketConnection({ io, db, socket }) {
  console.log("Socket connected", socket.id);
  socketsConected.add(socket.id);

  // io.emit("clients-total", socketsConected.size);

  socket.on("disconnect", () => {
    onSocketDisconnect(io, socket);
  });

  socket.on("create-room", function (createRoomData) {
    onCreateRoom({ io, socket, createRoomData });
  });

  socket.on("message", async (messageData) => {
    onSocketMessage(socket, db, messageData);
  });
}

function onSocketDisconnect(io, socket) {
  console.log("Socket disconnected", socket.id);
  socketsConected.delete(socket.id);
  // io.emit("clients-total", socketsConected.size);

  const sockeetRooms = io.sockets.adapter.rooms;
  for (const [key, value] of sockeetRooms) {
    io.in(key).emit("clients-total", value.size);
  }
}

function onCreateRoom({ io, socket, createRoomData }) {
  const { roomName } = createRoomData;

  const sockeetRooms = io.sockets.adapter.rooms;

  const _roomId = `${roomName}`;
  if (sockeetRooms[_roomId] && sockeetRooms[_roomId].has(socket.id)) {
    return;
  }

  socket.join(_roomId);

  for (const [key, value] of sockeetRooms) {
    io.in(key).emit("clients-total", value.size);
  }
}

async function onSocketMessage(socket, db, messageData) {
  const { name, message, userId, dateTime, login, chat } = messageData;

  const selectMessagesSql = `SELECT * FROM Chats WHERE id =  ` + chat.id;

  const dbChatInstanceRows = await db_all(db, selectMessagesSql);
  const dbMessages = JSON.parse(dbChatInstanceRows[0].messages);

  chatMessages = [
    ...dbMessages,
    {
      data: {
        name,
        message,
        userId,
        dateTime,
        login,
      },
    },
  ];
  // console.log("sending message in room: ", chat.id, messageData.message);
  socket.in(`${chat.id}`).emit("chat-message", messageData);

  const sql = `update CHATS set messages = ? where id = ?;`;

  const stringifiedMessages = JSON.stringify(chatMessages);
  const values = [stringifiedMessages, chat.id];

  db.serialize(function () {
    db.run(sql, values, function (err) {
      if (err) {
        console.error(err);
        // TODO: handle error
      }
      //     res.status(500).send(err);
      //   } else res.send();
    });
  });
}
