var app = require('express')()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

var clients = 0;
var log = "";

var broadcastClientCount = function(count) {
	io.sockets.emit('userCount', { desc: clients + ' clients connected!' });
}

io.on('connection', function(socket) {

	clients++;

	broadcastClientCount(clients);
	
	console.log('A user connected', socket.id);

	socket.on('clientMessage', function(message) {
		console.log(message);
		log += '<br />' + message
		io.sockets.emit('broadcast-log', log);
	})

	io.sockets.emit('broadcast-log', log);

	socket.on('disconnect', function() {
		clients--;
		broadcastClientCount(clients)
		console.log('A user disconnected', socket.id);
	});
});

http.listen(3901, function() {
	console.log('spying on 3901');
});

