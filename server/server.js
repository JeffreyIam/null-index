var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(express.static('../build-client'))

var users = []

io.on('connection', function(socket) {
  socket.emit('receiveId', socket.id)

  socket.on('sendUser', function(user) {
    users.push(Object.assign({}, user, {socket: socket}))
    io.emit('receiveUsers', users.map(user => ({name: user.name, id: user.id})))
  })

  socket.on('room', function(room) {
    users = users.map(user => {
      if (socket.id === user.id) {
        return Object.assign({}, user, {room: room})
      }
      return user
    })
  })

  socket.on('chatMessage', function(chatMessage) {
    var usersInRoom = users.filter(user => user.room === chatMessage.room)
    usersInRoom.forEach(user => user.socket.emit('receiveMessage', chatMessage))
  })

  socket.on('disconnect', function() {
    console.log(socket.id + ' has disconnected.')
    users = users.filter(user => user.id !== socket.id)
    io.emit('receiveUsers', users.map(user => ({name: user.name, id: user.id})))
  })
})

server.listen(1337)
