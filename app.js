/**
 * App configuration.
 */

var sio = require('socket.io');
var fs = require('fs');
var app = require('express').createServer(function(request, response) {
	fs.readFile('./index.html', function(error, content) {
		if (error) {
			response.writeHead(500);
			response.end();
		} else {
			response.writeHead(200, {
				'Content-Type' : 'text/html'
			});
			response.end(content, 'utf-8');
		}
	});
});

/**
 * App listen.
 */

app.listen(3000,
		function() {
			var addr = app.address();
			console.log('   app listening on http://' + addr.address + ':'
					+ addr.port);
		});

/**
 * Socket.IO server (single process only)
 */

var io = sio.listen(app), nicknames = {};

io.sockets.on('connection', function(socket) {
	socket.on('user message', function(msg) {
		socket.broadcast.emit('user message', socket.nickname, msg);
	});

	socket.on('user movement', function(msg) {
		socket.broadcast.emit('user movement', socket.nickname, msg);
	});

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

	socket.on('disconnect', function() {
		if (!socket.nickname)
			return;

		delete nicknames[socket.nickname];
		socket.broadcast
				.emit('announcement', socket.nickname + ' disconnected');
		socket.broadcast.emit('nicknames', nicknames);
	});
});
