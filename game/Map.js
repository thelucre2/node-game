
function Map( tileObjects, tileset, width, height ) {
	m = this;

	m.players = [];
	m.tileset = tileset;
	m.tileObjects = tileObjects;
	m.tiles = new Array([]);
	for(var x = 0; x < width; x++) {
		m.tiles[x] = [];
		for(var y = 0; y < height; y++) {
			var piece = Math.random();
			if(piece < 0.01) piece = 3;
			else if(piece < 0.10) piece = 2;
			else if(piece < 0.60) piece = 0;
			else piece = 1;
			m.tiles[x][y] = piece;
		}
	}
}

Map.prototype.draw = function( ctx ) {
	for(var x = 0; x < m.tiles.length-1; x++) {
		for(var y = 0; y < m.tiles[x].length-1; y++) {
			var tl = m.tileObjects[m.tiles[x][y]];
			ctx.drawImage(m.tileset.image,
				tl.coords.x, tl.coords.y,
				tl.coords.w, t.coords.h, 
				x * tl.coords.w, y * tl.coords.h, 
				tl.coords.w, tl.coords.h
			);
		}
	}
	for(var player = 0; player < m.players.length; player++) {
		m.players[player].draw( ctx );
	}
};

Map.prototype.addPlayer = function( playerData ) {
	if(!checkIfPlayerExists(playerData.id)) {
		var p = new Player( playerData.id, playerData.color );
		if(playerData.ypos !== undefined && playerData.xpos !== undefined) {
			p.ypos = playerData.ypos;
			p.xpos = playerData.xpos;
			p.x = playerData.x;
			p.y = playerData.y;
		}
		console.log('CLIENT: Map player added - ' + playerData.id +' @ (' + p.xpos + ',' + p.ypos + ')');
		socket.emit('playerCreate', p.getInfo());
		m.players.push(p);
		return p;
	} else {
		var player = getPlayerById( playerData.id );
		player.setInfo( playerData);
		return player;
	}
};

Map.prototype.update = function( frame, localPlayer ) {
	for(var player = 0; player < m.players.length; player++) {
		m.players[player].update( m.tiles, frame, localPlayer );
	}
};

Map.prototype.movePlayer = function(frame, data) {
	var pid = data.player;
	var direction = data.direction;
	for(var player = 0; player < m.players.length; player++) {
		if(pid == m.players[player].id && m.players[player].state == 0) {
			switch(direction) {
				case Key.UP:
					m.players[player].moveUp(m.tiles, frame);
					break;
				case Key.DOWN:
					m.players[player].moveDown(m.tiles, frame);
					break;
				case Key.LEFT:
					m.players[player].moveLeft(m.tiles, frame);
					break;
				case Key.RIGHT:
					m.players[player].moveRight(m.tiles, frame);
					break;
			}
			break; // found our player, break out;
		}
	}
};


function checkIfPlayerExists( playerid ) {
	if(ga.localPlayer) {
		if(ga.localPlayer.id == playerid) return true;
	}
	for(var player = 0; player < m.players.length; player++) {
		if(m.players[player].id != undefined && m.players[player].id == playerid )
			return true;
	}
	return false;
}

function getPlayerById( id ) {
	for(var player = 0; player < m.players.length; player++) {
		if(m.players[player].id == id )
			return m.players[player];
	}
	return null;
}

Map.prototype.removePlayer = function( id ) {
	for(var player = 0; player < m.players.length; player++) {
		if(m.players[player].id == id )
			m.players.splice( player, 1 );
	}
};