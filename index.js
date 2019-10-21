const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const {
  addUser,
  removeUser,
  getUser,
  getUsersRoom,
} = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const router = require('./router');

app.use(router);

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });

    return callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    return callback();
  });

  socket.on('disconnect', () => {
    console.log('user has left');
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server has started on port ${process.env.PORT || 5000}`);
});
