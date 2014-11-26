
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var socket_io = require('socket.io');
var mongoose = require('mongoose');
//var users = require('./db/users.json');

var app = express();

app.set('port',3000);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'ejs');

// Connect to mongodb
mongoose.connect('mongodb://localhost/test');

var schema = new mongoose.Schema({user: 'string', color: 'string', message: 'string'});
var Message = mongoose.model('Message', schema);


//Обработака favicon.ico
//app.use(express.favicon());

var server = http.createServer(app);

var io = socket_io(server);


app.get('/',function(req, res, next) {
	res.render("login", {});
})

// Обработака get запроса
app.get('/sign',function(req, res, next) { 

})

//Обработка post запроса
app.post('/sign',function(req, res, next) { 
  var nickname = req.body.nick;

  res.render("main", {nick: JSON.stringify(nickname)});
})

app.use(express.static(path.join(__dirname, 'public')));


//Socket
io.on('connection', function(socket){
  
  // Current user
  var user = {};

  socket.on('new-user', function(data) {
    
    user.nick = data.nick;
    user.color = data.color;

    //Get data from database
    var inform = Message.find({}, function(err, data) {
      //console.log(data);
      // socket.broadcast.emit('user-joined', {nick: user.nick});
      socket.emit('load-history', {data: data})
    })

    socket.broadcast.emit('user-joined', {nick: user.nick})
  })

  socket.on('new-message', function(data) {
    user.note = data.value;

    //Put data in database
    var inform = new Message({user: user.nick, color: user.color, message: user.note});
    
    inform.save(function(err) {
      if (err) {
        return handlerError(err);
      }
    })

    // Emits an event to all connected users
    io.sockets.emit('append-text',{nick: user.nick, color: user.color, text: user.note});
  })

  socket.on('disconnect', function() {
    if (user.nick) {
      // Show that current user has left the chat
      socket.broadcast.emit('user-left', {nick: user.nick}); 
    }
  })
})

server.listen(3000, '178.62.28.108', function(){
  console.log('Express server listening on port 3000');
});
