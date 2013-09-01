var settings = {
	'width' : 10,
	'height' : 10,
	'tilesize' : 32,
	'FPS': 20 
}
var Key;
var game;
var frame = 0; 
var socket = io.connect();
var util = new Util();
var playerID;

$(document).ready( function() {

	game = new Game(settings);
	initInput();

	loop();

  $('#clear-char').on('click', function(e) {
    game.map.removePlayer( $.cookie('player'));
    $.cookie('x', '0');
    $.cookie('y', '0');
    $.cookie('xpos', '0');
    $.cookie('ypos', '0');
    game.setupMainPlayer();
  });

});

function loop() {

	switch(game.state) {
		case game.STATES.RUNNING:
			game.update( frame );
			game.draw();
	}

	frame++;
	
	// new loop at FPS and framecounter increment
	setTimeout(function() {
        requestAnimationFrame(loop);
        // Drawing code goes here
    }, 1000 / settings.FPS);
}

function initInput() {
	Key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },

    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
      delete this._pressed[event.keyCode];
    }
  };
      
  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
}