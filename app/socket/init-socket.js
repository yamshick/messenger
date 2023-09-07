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

module.exports = function (io, db) {
  let socketsConected = new Set();
  let rooms = [];

  io.sockets.on("connection", function (socket) {
    onSocketConnection({ io, db, socket, socketsConected, rooms });
  });
};

function onSocketConnection({ io, db, socket, socketsConected, rooms }) {
  console.log("Socket connected", socket.id);
  socketsConected.add(socket.id);

  // io.emit("clients-total", socketsConected.size);

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    socketsConected.delete(socket.id);
    // io.emit("clients-total", socketsConected.size);

    // removing room
    try {
      console.log("rooms", rooms);
      const room = rooms.find((room) => room?.socketIds?.includes(socket.id));
      if (room) {
        console.log("found room on disconect", room);
        room.socketIds = room?.socketIds?.filter(
          (socketId) => socketId !== socket.id
        );
        if (room?.socketIds?.length === 0) {
          const roomId = room.id;
          rooms = rooms?.filter((room) => room.id !== roomId);
        }
      }
    } catch (e) {
      console.error("removing room error", { e });
    }
  });

  socket.on("create-room", function (createRoomData) {
    const { chat } = createRoomData;
    // console.log({
    //   createRoomData,
    //   socketId: socket.id,
    // });
    const roomId = chat.id;
    const socketId = socket.id;
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      console.log("__found existing room", { room });
    }

    if (room && room.socketIds.includes(socketId)) {
      return;
    }

    if (!room) {
      rooms.push({
        id: roomId,
        socketIds: [socketId],
      });
    } else if (!room.socketIds.includes(socketId)) {
      room.socketIds.push(socketId);
    }

    socket.join(chat.id);
  });

  socket.on("message", async (messageData) => {
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
    // chat.messages = chatMessages;
    // socket.in(chat.id).broadcast.emit("chat-message", messageData);
    // console.log("socket message event", { messageData });
    // console.warn("chatMessages", chatMessages);
    console.log('sending message in room: ', chat.id)
    socket.in(`${chat.id}`).emit("chat-message", messageData);

    const sql = `update CHATS set messages = ? where id = ?;`;

    const stringifiedMessages = JSON.stringify(chatMessages);
    // console.log([stringifiedMessages]);
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
  });
}
