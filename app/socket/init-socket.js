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
let rooms = [];

module.exports = function (io, db) {
  io.sockets.on("connection", function (socket) {
    onSocketConnection({ io, db, socket });
  });
};

function onSocketConnection({ io, db, socket }) {
  console.log("Socket connected", socket.id);
  socketsConected.add(socket.id);

  const sockeetRooms = io.sockets.adapter.rooms
  console.log({sockeetRooms})
  for (const [key, value] of sockeetRooms) {
    io.in(key).emit('clients-total', value.size)
  }
  // io.emit("clients-total", socketsConected.size);

  socket.on("disconnect", () => {
    onSocketDisconnect(io, socket)
  });

  socket.on("create-room", function (createRoomData) {
    onCreateRoom({io, socket, createRoomData});
  });

  socket.on("message", async (messageData) => {
    onSocketMessage(socket, db, messageData);
  });
}

function onSocketDisconnect(io, socket) {
  console.log("Socket disconnected", socket.id);
  socketsConected.delete(socket.id);
  // io.emit("clients-total", socketsConected.size);

  const sockeetRooms = io.sockets.adapter.rooms
  for (const [key, value] of sockeetRooms) {
    io.in(key).emit('clients-total', value.size)
  }
  console.log('onSocketDisconnect', {sockeetRooms})
  return;
  // removing room
  try {
    console.log("rooms", rooms);
    const room = rooms.find((room) => room?.socketIds?.includes(socket.id));

    if (room) {
      console.log("found room on disconect", room);
      // io.in(room.id).socketsLeave("room1");
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
}

function onCreateRoom({io, socket, createRoomData}) {
  const { roomName } = createRoomData;
  // console.log({
  //   createRoomData,
  //   socketId: socket.id,
  // });

  const sockeetRooms = io.sockets.adapter.rooms
  console.log('onCreateRoom', {roomName, sockeetRooms})

  const _roomId = `${roomName}`; 
  if (sockeetRooms[_roomId] && sockeetRooms[_roomId].has(socket.id)) {
    return;
  }

  socket.join(_roomId);

  // console.log('onCreateRoom', {roomName, sockeetRooms})
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
  // chat.messages = chatMessages;
  // socket.in(chat.id).broadcast.emit("chat-message", messageData);
  // console.log("socket message event", { messageData });
  // console.warn("chatMessages", chatMessages);
  console.log('sending message in room: ', chat.id, 
  messageData.message)
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
}
    