
function Tileset( image, tileSize, cb ) {
	ts = this;
	ts.tiles = [];
	ts.tileSize = tileSize;
	ts.tileTypes = [
		'grass',
		'water',
		'moutains',
		'house'
	];

	ts.image = document.createElement('img');
	ts.image.onload = function() {
		for(var x = 0; x < ts.image.width/ts.tileSize; x++) {
			var tile = new Tile( ts.tileTypes[x],
													 { 'x' : x * ts.tileSize,
													 	 'y' : 0,
													 	 'w' : ts.tileSize,
													 	 'h' : ts.tileSize }
													);
			ts.tiles.push( tile );
		}
		cb();
	}
	ts.image.src= image;

}

Tileset.prototype.getTiles = function() {
	return ts.tiles;
};
