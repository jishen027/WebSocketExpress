const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/user')



const app = express()
const server = http.createServer(app)
const io = socketio(server)

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'chat bot'

//run when client connects
io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)


    // single clients
    socket.emit('message', formatMessage(botName, "welcome to the chat room"))

    // all clients except the  connecting one
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} join to the chat`))

    // all clients
    // io.emit()

    // Run when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id)
      if (user) {
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} left the chat`))
      }
    })

  })

  // Listen for chat message
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg))
  })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)

