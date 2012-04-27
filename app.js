var io = require('socket.io');
var fs = require('fs');
var app = require('express').createServer(function(request, response){
    fs.readFile('./index.html', function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        }
        else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
        }
})})
  , io = io.listen(app);


app.listen(4000);


// SOCKET.IO functions
io.sockets.on('connection', function (socket) {

 socket.emit('news', { hello: 'you are now connected' });
  socket.on('connectEvent', function (data) {
    console.log(data);
  });

  // server broadcast
  socket.on('helloeveryone', function (msg) {

    socket.broadcast.emit('helloeveryone',  msg );
    socket.emit('helloeveryone', msg );
    console.log(msg);
  });


  socket.on('disconnect', function () {
	console.log("disconnected"); 
  });



});
