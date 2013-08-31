

var Game = function( settings ) {
	ga = this;
	ga.STATES = { 
		'LOADING' : 0,
		'RUNNING'	: 1 };
	ga.state = ga.STATES.LOADING;
	ga.map = null;
	ga.canv = document.createElement('canvas');
	ga.canv.width = settings.tilesize * settings.width;
	ga.canv.height = settings.tilesize * settings.height;
	ga.ctx = ga.canv.getContext('2d');
	

	ga.ts = new Tileset(
		'tiles.png', 	// tile set to load
		settings.tilesize, 					// sie of each tile
		function() {	// call back after tiles are loaded
			document.body.appendChild(ga.canv);
			ga.map = new Map( ga.ts.getTiles(), ga.ts, settings.width, settings.height );
			ga.setupPlayer();
		}
	);

	ga.setupPlayer = function() {
		ga.map.addPlayer('lucre', '#c00');
		ga.state = ga.STATES.RUNNING;
	}
}

Game.prototype.update = function() {
	ga.map.update( frame );
};

Game.prototype.draw = function() {
	ga.canv.width = ga.canv.width;
	ga.map.draw( ga.ctx );
};