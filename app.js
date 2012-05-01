
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
,sio = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'nyancat' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
console.log("server started at %s", (new Date()).toUTCString());
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

});




/**
 * Socket.IO server (single process only)
 */
var io = sio.listen(app), nicknames = {};


io.sockets.on('connection', function(socket) {

	// user sends a message
	socket.on('user message', function(msg) {
		socket.broadcast.emit('user message', socket.nickname, msg);
	});

	// user movement
	socket.on('user movement', function(msg) {
		socket.broadcast.emit('user movement', socket.nickname, msg);
	});

	// set new nickname announcement
	socket.on('nickname', function(nick, fn) {
		if (nicknames[nick]) {
			fn(true);
		} else {
			fn(false);
			nicknames[nick] = socket.nickname = nick;
			socket.broadcast.emit('announcement', nick + ' connected');
			io.sockets.emit('nicknames', nicknames);
		}
	});

	// user disconnects
	socket.on('disconnect', function() {
		if (!socket.nickname)
			return;

		delete nicknames[socket.nickname];
		socket.broadcast
				.emit('announcement', socket.nickname + ' disconnected');
		socket.broadcast.emit('nicknames', nicknames);
	});
});

