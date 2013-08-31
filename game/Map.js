
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

Map.prototype.addPlayer = function( name, color ) {
	var p = new Player( name, color );
	m.players.push(p);
};

Map.prototype.update = function( frame ) {
	for(var player = 0; player < m.players.length; player++) {
		m.players[player].update( m.tiles, frame );
	}
};

