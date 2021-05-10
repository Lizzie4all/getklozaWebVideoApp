const express = require('express');
const router = express.Router();
const server = require('http').Server(router)
//const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

router.use('/peerjs', peerServer);



router.get('/', (req, res) => {
    res.render('join');
});

router.post('/meet', (req, res) => {
    console.log(req.body.meetingId)
    res.redirect('/room?room='+req.body.meetingId);
});



module.exports = router;