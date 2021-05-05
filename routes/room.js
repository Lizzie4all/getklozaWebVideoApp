const express = require('express');
const router = express.Router();
const server = require('http').Server(router)
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

router.use('/peerjs', peerServer);
router.use(express.static('public'))

router.get('/:room', (req, res) => {
    if(req.query.room){
      res.render('room', { roomId: req.query.room })
    }else{
      res.render('room', { roomId: req.params.room })
    }

  })

  io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('message', message =>{
            io.to(roomId).emit('createMessage', message)
        })
    })
})

  
module.exports = router;