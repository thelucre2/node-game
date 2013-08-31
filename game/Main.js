var settings = {
	'width' : 25,
	'height' : 15,
	'tilesize' : 32,
	'FPS': 30 
}
var Key;
var game;
var frame = 0; 

$(document).ready( function() {

	game = new Game(settings);
	initInput();

	loop();

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