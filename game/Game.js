

var Game = function( settings ) {
	ga = this;
	ga.STATES = { 
		'LOADING' : 0,
		'RUNNING'	: 1 };
	ga.state = ga.STATES.LOADING;
	ga.map = null;
	ga.localPlayer = null;
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
			ga.setupMainPlayer( );
		}
	);

}

Game.prototype.setupMainPlayer = function(  ) {
	console.log('local player? :' +  $.cookie('player'));
	if($.cookie('player') == '' || $.cookie('player') == undefined) {
		playerID = util.randomColor();
		ga.localPlayer = ga.map.addPlayer( { "id" : playerID, "color" : playerID });
		ga.localPlayer.updatePlayerCookie( playerID, 0, 0, 0, 0 );
	} else {
		playerID = $.cookie('player');
		ga.localPlayer = ga.map.addPlayer( { "id" : playerID, 
																				 "color" : playerID,
																				 "x" : $.cookie('x'),
																				 "y" : $.cookie('y'),
																				 "xpos" : $.cookie('xpos'),
																				 "ypos" : $.cookie('ypos'), });
	}
	console.log('local player :' +  $.cookie('player'));
	socket.emit('getOtherPlayers', { "requester": ga.localPlayer.id });
	ga.state = ga.STATES.RUNNING;
}

Game.prototype.addRemotePlayer = function( playerData ) {
	ga.map.addPlayer( playerData );
}

Game.prototype.update = function() {
	ga.map.update( frame, ga.localPlayer.id );
};

Game.prototype.draw = function() {
	ga.canv.width = ga.canv.width;
	ga.map.draw( ga.ctx );
};

Game.prototype.movePlayer = function(data) {
	ga.map.movePlayer( frame, data );
	//console.log(data);
};

Game.prototype.getLocalPlayer = function( requester ) {
	if(ga.localPlayer !== null)
		if(ga.localPlayer.id != requester)
			return ga.localPlayer;
	console.log("CLIENT: local playey getInfo by '" + requester + "' - got " + ga.localPlayer.id );
};
