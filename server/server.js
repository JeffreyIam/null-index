var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(express.static('../build-client'))

var users = []

io.on('connection', function(socket) {
  socket.on('sendUser', function(user) {
    users.push(user)
    io.emit('receiveUsers', users)
  })
  socket.emit('receiveId', socket.id)

  socket.on('chatMessage', function(chatMessage) {
    io.emit('receiveMessage', chatMessage)
  })
  socket.on('disconnect', function() {
    console.log(socket.id + ' has disconnected.')
    users = users.filter(user => user.id !== socket.id)
    io.emit('receiveUsers', users)
  })
})

server.listen(1337)
