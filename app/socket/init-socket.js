module.exports = function (io, db) {

    let socketsConected = new Set();
    let rooms = []
    
    io.sockets.on('connection', function(socket) {
        console.log("Socket connected", socket.id);
        socketsConected.add(socket.id);

        io.emit("clients-total", socketsConected.size);

        socket.on("disconnect", () => {
            console.log("Socket disconnected", socket.id);
            socketsConected.delete(socket.id);
            io.emit("clients-total", socketsConected.size);
            // removing room
            try {
                const room = rooms.find(room => room.socketIds.includes())
                room.socketIds = room.socketIds.filter(socketId => socketId !== socket.id)
                if (room.socketIds.length === 0) {
                    const roomId = room.id
                    rooms = rooms.filter(room => room.id !== roomId)
                }    
            } catch (e) {
                console.error('removing room error', {e})
            }
          });
                

        socket.on('create-room', function(createRoomData) {
            const {chat} = createRoomData
            console.log({
                createRoomData,
                socketId: socket.id
            })
            const roomId = chat.id
            const socketId = socket.id
            const room = rooms.find(room => room.id === roomId)
            if (room) {
                console.log('__found existing room', {room})
            }

            if (room && room.socketIds.includes(socketId)) {
                return;
            }

            if (!room) {
                rooms.push({
                    id: roomId,
                    socketIds: [socketId]
                })
            } else if (!room.socketIds.includes(socketId)) {
                room.socketIds.push(socketId)
            }

          socket.join(chat.id);
        });

        socket.on("message", (messageData) => {
            console.log(messageData);
            const {chat} = messageData 
            // socket.in(chat.id).broadcast.emit("chat-message", messageData);
            socket.in(chat.id).emit("chat-message", messageData);
        })

      });
};
  