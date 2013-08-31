
var Player = function( name, color ) {
	pl = this;

	pl.STATE = {
		'CANMOVE' : 0,
		'MOVING' : 1,
		'IMMOBILE' : 2
	};
	pl.frameSince = 0;
	pl.size = 32;
	pl.direction = Key.DOWN;
	pl.state = pl.STATE.CANMOVE;
	pl.name = name;
	pl.color = color;
	pl.x = 0;
	pl.y = 0;
	pl.xpos = 0;
	pl.ypos = 0;
	pl.speed = 10;
	
}

Player.prototype.draw = function( ctx ) {
	//console.log('drawing player, ' + pl.name );
	ctx.fillStyle = pl.color;
	ctx.fillRect(pl.x, pl.y,pl.size,pl.size);
};


Player.prototype.moveLeft = function( tiles, frame ) {
  pl.frameSince = frame;
	pl.direction = Key.LEFT;
	//if(!tiles[pl.xpos - 1][pl.ypos] == 1)
		pl.xpos--;
	pl.setState(pl.STATE.MOVING);  
};

Player.prototype.moveRight = function( tiles, frame ) {
	pl.frameSince = frame;
	pl.direction = Key.RIGHT;
	//if(!tiles[pl.xpos + 1][pl.ypos] == 1)
		pl.xpos++;
	pl.setState(pl.STATE.MOVING);  
};

Player.prototype.moveUp = function( tiles, frame ) {
	//if(!tiles[pl.xpos][pl.ypos - 1] == 1) {
	  pl.frameSince = frame;
		pl.direction = Key.UP;
			pl.ypos--;
		pl.setState(pl.STATE.MOVING);
};

Player.prototype.moveDown = function( tiles, frame ) {
	//if(!tiles[pl.xpos][pl.ypos + 1] == 1) {
		pl.frameSince = frame;
		pl.direction = Key.DOWN;
			pl.ypos++;
		pl.setState(pl.STATE.MOVING);  

};

Player.prototype.update = function(tiles, frame) {
	
	switch(pl.state) {
		case pl.STATE.CANMOVE:
		  if (Key.isDown(Key.UP)) { pl.moveUp(tiles, frame); break; }
		  if (Key.isDown(Key.LEFT)) { pl.moveLeft(tiles, frame); break; }
		  if (Key.isDown(Key.DOWN)) { pl.moveDown(tiles, frame); break; }
		  if (Key.isDown(Key.RIGHT)) { pl.moveRight(tiles, frame); break; }
		  break;
		case pl.STATE.MOVING:
			pl.animate(pl.direction);
	  }
};

Player.prototype.animate = function( direction ) {
	switch(direction) {
		case Key.DOWN:
			var movement = pl.size / pl.speed;
	  	pl.y += movement;
	  	if(frame > pl.frameSince + pl.speed || 
	  		 pl.ypos * pl.size + pl.size <= pl.y + pl.size )  {
	  		pl.setState(pl.STATE.CANMOVE);
	  		pl.y = pl.ypos * pl.size;
	  	}
	  	break;
	  case Key.UP:
			var movement = pl.size / pl.speed;
	  	pl.y -= movement;
	  	if(frame > pl.frameSince + pl.speed || 
	  		 pl.ypos * pl.size >= pl.y )  {
	  		pl.setState(pl.STATE.CANMOVE);
	  		pl.y = pl.ypos * pl.size;
	  	}
	  	break;
	  	case Key.RIGHT:
			var movement = pl.size / pl.speed;
	  	pl.x += movement;
	  	if(frame > pl.frameSince + pl.speed || 
	  		 pl.xpos * pl.size + pl.size <= pl.x + pl.size )  {
	  		pl.setState(pl.STATE.CANMOVE);
	  		pl.x = pl.xpos * pl.size;
	  	}
	  	break;
	  case Key.LEFT:
			var movement = pl.size / pl.speed;
	  	pl.x -= movement;
	  	if(frame > pl.frameSince + pl.speed || 
	  		 pl.xpos * pl.size >= pl.x )  {
	  		pl.setState(pl.STATE.CANMOVE);
	  		pl.x = pl.xpos * pl.size;
	  	}
	  	break;
	}	
};

Player.prototype.setState = function( state ) {
	pl.state = state;
};