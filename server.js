const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const { ExpressPeerServer } = require ('peer');
const peerServer = ExpressPeerServer(server, {
   debug: true
});

const login = require('./routes/login');
const signUp = require('./routes/signUp');
const room = require('./routes/room');
const join = require('./routes/join');
const invite = require('./routes/invite');
const forgetpass = require('./routes/forgetpass');

mongoose.connect('mongodb+srv://mustapha-ahmed:ADEbayor95@cluster0.23w5d.mongodb.net/getKloza?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', login);
app.use('/signUp', signUp);
app.use('/room', room);
app.use('/join', join);
app.use('/invite', invite);
app.use('/forgetpass', forgetpass);

app.get('/room', (req, res) => {
  res.redirect(`/room/${uuidv4()}`)
});
app.get('/invite', (req, res) => {
  res.redirect(`/invite/<%= roomId %>`)
});


//catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('message', message =>{
            io.to(roomId).emit('createMessage', message)
        })
    })
})  
 
server.listen(process.env.PORT||3030, ()=> console.log(`Server running successfully`))
