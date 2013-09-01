var	socketio = require('socket.io')
,		io
,		guestNumber = 1
,		nickNames = {}
,		namesUsed = []
,		currentRoom = {}
,		players = [];

exports.listen = function(server) {
	io = socketio.listen(server);
	io.set('log level', 1);
	io.sockets.on('connection', function (socket) {
		// GAMEPLAY
		handlePlayerMovement(socket);
		handlePlayerCreate(socket);
		handleGetCurrentPlayers(socket);
		handleSendLocalPlayer(socket);

		// CHAT
		guestNumber = assignGuestName(socket, guestNumber,
		nickNames, namesUsed);
		joinRoom(socket, 'Lobby');

		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);

		socket.on('rooms', function() {
			socket.emit('rooms', io.sockets.manager.rooms);
		});

		handleClientDisconnection(socket, nickNames, namesUsed);
	});
};

// GAMEPLAY ////////////////////////////////////////////////////////
function handlePlayerMovement(socket) {
	socket.on('playerMove', function (data) {
		var pIndex = players.indexOf(data.id);
		players[pIndex] = data;
		//console.log('SERVER: player moved - ' + data.direction);
		socket.broadcast.to('Lobby').emit('playerMoved', data);
	});
}

function handlePlayerCreate(socket) {
	socket.on('playerCreate', function (data) {
		console.log('SERVER (line 46): ' + data.id + ', ' + data.color + ', ' + data.xpos + ', ' + data.ypos);
		var pIndex = players.indexOf(data.id);
		if(pIndex >= 0) {
			players.slice(pIndex, 1);
		}
		players.push(data);
		console.log('SERVER: player created -' + data.id + '\n' + data );
/*		for(var p = 0; p < players.length; p++) {
			console.log("players: " + players[p]);
		}		*/	
		socket.broadcast.to('Lobby').emit('playerCreated', data);
	});
}

function handleGetCurrentPlayers(socket) {
	socket.on('getOtherPlayers', function (data) {
		console.log('SERVER: current local players requested - ' + data.requester);
		socket.broadcast.to('Lobby').emit('requestLocalPlayer', data);
	});
}

function handleSendLocalPlayer(socket) {
	socket.on('sendLocalPlayer', function ( playerData ) {
		console.log('SERVER: local player received - ' + playerData.player.id + ', ' + playerData.player.color );
		socket.broadcast.to('Lobby').emit( 'localPlayerSent', playerData.player );
	});
}

// CHAT ////////////////////////////////////////////////////////////

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	var name = 'Guest' + guestNumber;
	nickNames[socket.id] = name;

	socket.emit('nameResult', {
		success: true,
		name: name
	});

	namesUsed.push(name);
	return guestNumber + 1;
}

function joinRoom(socket, room) {
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('joinResult', {room: room});

	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	});

	var usersInRoom = io.sockets.clients(room);
	if (usersInRoom.length > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for (var index in usersInRoom) {
			var userSocketId = usersInRoom[index].id;
			if (userSocketId != socket.id) {
				if (index > 0) {
					usersInRoomSummary += ', ';
				}
				usersInRoomSummary += nickNames[userSocketId];
			}
		}
		usersInRoomSummary += '.';
		socket.emit('message', {text: usersInRoomSummary});
	}
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
	socket.on('nameAttempt', function(name) {
		if (name.indexOf('Guest') == 0) {
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "Guest".'
			});
		} else {
			if (namesUsed.indexOf(name) == -1) {
				var previousName = nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name);
				nickNames[socket.id] = name;
				delete namesUsed[previousNameIndex];
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				});
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				});
			}
		}
	});
}

function handleMessageBroadcasting(socket) {
	socket.on('message', function (message) {
		socket.broadcast.to(message.room).emit('message', {
				text: nickNames[socket.id] + ': ' + message.text
		});
	});
}

function handleRoomJoining(socket) {
	socket.on('join', function(room) {
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, room.newRoom);
	});
}

function handleClientDisconnection(socket) {
	socket.on('disconnect', function() {
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nickNames[socket.id];
	});
}