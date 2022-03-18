const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')



const app = express()
const server = http.createServer(app)
const io = socketio(server)

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'chat bot'

//run when client connects
io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {
    // single clients
    socket.emit('message', formatMessage(botName, "welcome to the chat room"))

    // all clients except the  connecting one
    socket.broadcast.emit('message', formatMessage(botName, 'a user joined chat'))

    // all clients
    // io.emit()

    // Run when client disconnects
    socket.on('disconnect', () => {
      io.emit('message', formatMessage(botName, 'A user has left the chat'))
    })

  })

  // Listen for chat message
  socket.on('chatMessage', msg => {
    io.emit('message', formatMessage('USRE', msg))
  })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)

