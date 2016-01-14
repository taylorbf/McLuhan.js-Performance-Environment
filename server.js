/***********************
*   McLuhan.js Server  *
***********************/

/* "node server.js" starts local server with this script */


/* Definitions */
var express = require('express');
var app = express();

// for heroku
var port = process.env.PORT || 8080;

var http = require('http').Server(app);
var io = require('socket.io')(http);

// basic server
app.use(express.static(__dirname + '/pages'));
app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

http.listen(port, function(){
  console.log('listening on *:8080');
});


// user management
var users = {}
var userindex = 0
var disconnections = 0



// listening for events
io.sockets.on('connection', function (socket) {

	socket.emit("mediapaths","video",mediapaths.video)
	socket.emit("mediapaths","audio",mediapaths.audio)
	socket.emit("mediapaths","images",mediapaths.images)

	// generate user identifiers
	userindex++
	var name = "user"+userindex;
	socket.username = name;
	users[name] = name;
	io.sockets.emit('updateusers', io.nsps["/"].sockets.length);
  io.sockets.emit('discotally', disconnections);
	console.log(io.nsps["/"].sockets.length)

  socket.on('disconnect', function(){
    delete users[socket.username]
    disconnections++
		io.sockets.emit('updateusers', io.nsps["/"].sockets.length);
  	io.sockets.emit('discotally', disconnections);
  });

	/* Send gestures to all users 
 	(conceived as a "chat" of gestures)
 	two parameters: type and data  */

	socket.on('senddata', function (type, data) {
		/* broadcast data */
		io.sockets.emit('updatedata', type, data);
	});


	socket.on('presence', function (data) {
		/* return update data */
		io.sockets.emit('updatepresence', data);
	});

});



// retrieve media paths

var fs = require("fs")
var mediapaths = {}


fs.readdir('pages/media/video/', function(err, files) {
  if (err) throw err;
  console.log(files)
  for (var i=0;i<files.length;i++) {	
  	if (files[i][0] == ".") {
  		files.splice(i,1)
  		i--
  	} else {
  		files[i] = '/media/video/'+ files[i]
  	}
  }
  mediapaths.video = files
})

fs.readdir('pages/media/audio/', function(err, files) {
  if (err) throw err;
  for (var i=0;i<files.length;i++) {
  	if (files[i][0] == ".") {
  		files.splice(i,1)
  		i--
  	} else {
  		files[i] = '/media/audio/'+ files[i]
  	}
  }
  console.log(files)
  mediapaths.audio = files
})

fs.readdir('pages/media/images/', function(err, files) {
  if (err) throw err;
  console.log(files)
  for (var i=0;i<files.length;i++) {
  	if (files[i][0] == ".") {
  		files.splice(i,1)
  		i--
  	} else {
  		files[i] = '/media/images/'+ files[i]
  	}
  }
  mediapaths.images = files
})
