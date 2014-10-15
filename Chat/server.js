
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var socket_io = require('socket.io');
//var users = require('./db/users.json');

var app = express();

app.set('port',3000);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'ejs');

//Обработака favicon.ico
//app.use(express.favicon());

var server = http.createServer(app);

var io = socket_io(server);


app.get('/',function(req, res, next) {
	res.render("index", { });
})

// Обработака get запроса
app.get('/sign',function(req, res, next) { })

//Обработка post запроса
app.post('/sign',function(req, res, next) { })

app.use(express.static(path.join(__dirname, 'public')));

//Users connected to chat
var usersCount = 0;

io.on('connection', function(socket){
  
  // Current user
  var user = {};

  socket.on('new-user', function(data) {
    
    user.nick = data.nick;
    user.color = data.color;
    // Show chat for current user
    socket.emit('show-chat');
    // Show the joined user for other users
    socket.broadcast.emit('user-joined', {nick: user.nick})
  })

  socket.on('new-message', function(data) {
    user.note = data.value;
    // Emits an event to all connected users
    io.sockets.emit('append-text',{nick: user.nick, color: user.color, text: user.note});
  })

  socket.on('disconnect', function() {
    if (user.nick) {
      socket.broadcast.emit('user-left', {nick: user.nick}); 
    }
  })
})

server.listen(3000, '178.62.28.108', function(){
  console.log('Express server listening on port 3000');
});
