
var Player = function( name, color ) {

	this.STATE = {
		'CANMOVE' : 0,
		'MOVING' : 1,
		'IMMOBILE' : 2
	};
	this.id = name;
	this.frameSince = 0;
	this.size = 32;
	this.direction = Key.DOWN;
	this.state = this.STATE.CANMOVE;
	this.color = color;
	this.x = 0;
	this.y = 0;
	this.xpos = 0;
	this.ypos = 0;
	this.speed = 10;
}

Player.prototype.draw = function( ctx ) {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y,this.size,this.size);
};


Player.prototype.moveLeft = function( tiles, frame ) {
  this.frameSince = frame;
	this.direction = Key.LEFT;
	//if(!tiles[this.xpos - 1][this.ypos] == 1)
		this.xpos--;
	socket.emit('playerMove', { "player" : this.id, "direction" : this.direction });
	//console.log("CLIENT: player moving emitted - " + this.id + ", " + this.direction);
	this.setState(this.STATE.MOVING);  
};

Player.prototype.moveRight = function( tiles, frame ) {
	this.frameSince = frame;
	this.direction = Key.RIGHT;
	//if(!tiles[this.xpos + 1][this.ypos] == 1)
		this.xpos++;
	socket.emit('playerMove', { "player" : this.id, "direction" : this.direction });
	//console.log("CLIENT: player moving emitted - " + this.id + ", " + this.direction);
	this.setState(this.STATE.MOVING);  
};

Player.prototype.moveUp = function( tiles, frame ) {
	//if(!tiles[this.xpos][this.ypos - 1] == 1) {
	  this.frameSince = frame;
		this.direction = Key.UP;
			this.ypos--;
		socket.emit('playerMove', { "player" : this.id, "direction" : this.direction });
		//console.log("CLIENT: player moving emitted - " + this.id + ", " + this.direction);
		this.setState(this.STATE.MOVING);
};

Player.prototype.moveDown = function( tiles, frame ) {
	//if(!tiles[this.xpos][this.ypos + 1] == 1) {
		this.frameSince = frame;
		this.direction = Key.DOWN;
		this.ypos++;
		socket.emit('playerMove', { "player" : this.id, "direction" : this.direction });
		//console.log("CLIENT: player moving emitted - " + this.id + ", " + this.direction);
		this.setState(this.STATE.MOVING);  

};

Player.prototype.update = function(tiles, frame, localPlayer ) {
	switch(this.state) {
		case this.STATE.CANMOVE:
			if(this.id == localPlayer) {
			  if (Key.isDown(Key.UP)) { this.moveUp(tiles, frame); break; }
			  if (Key.isDown(Key.LEFT)) { this.moveLeft(tiles, frame); break; }
			  if (Key.isDown(Key.DOWN)) { this.moveDown(tiles, frame); break; }
			  if (Key.isDown(Key.RIGHT)) { this.moveRight(tiles, frame); break; }
			  this.updatePlayerCookie();
			}
		  break;
		case this.STATE.MOVING:
			this.animate(this.direction);
	  }
};

Player.prototype.animate = function( direction ) {
	switch(direction) {
		case Key.DOWN:
			var movement = this.size / this.speed;
	  	this.y += movement;
	  	if(frame > this.frameSince + this.speed || 
	  		 this.ypos * this.size + this.size <= this.y + this.size )  {
	  		this.setState(this.STATE.CANMOVE);
	  		this.y = this.ypos * this.size;
	  	}
	  	break;
	  case Key.UP:
			var movement = this.size / this.speed;
	  	this.y -= movement;
	  	if(frame > this.frameSince + this.speed || 
	  		 this.ypos * this.size >= this.y )  {
	  		this.setState(this.STATE.CANMOVE);
	  		this.y = this.ypos * this.size;
	  	}
	  	break;
	  	case Key.RIGHT:
			var movement = this.size / this.speed;
	  	this.x += movement;
	  	if(frame > this.frameSince + this.speed || 
	  		 this.xpos * this.size + this.size <= this.x + this.size )  {
	  		this.setState(this.STATE.CANMOVE);
	  		this.x = this.xpos * this.size;
	  	}
	  	break;
	  case Key.LEFT:
			var movement = this.size / this.speed;
	  	this.x -= movement;
	  	if(frame > this.frameSince + this.speed || 
	  		 this.xpos * this.size >= this.x )  {
	  		this.setState(this.STATE.CANMOVE);
	  		this.x = this.xpos * this.size;
	  	}
	  	break;
	}	
};

Player.prototype.setState = function( state ) {
	this.state = state;
};

Player.prototype.getInfo = function() {
	return { "id" : this.id,
					 "color"  : this.color,
					 "xpos"		: this.xpos,
					 "ypos"   : this.ypos,
					 "x"			: this.x,
					 "y"			: this.y }
}

Player.prototype.setInfo = function( data ) {
	this.x = data.x;
	this.y = data.y;
	this.xpos = data.xpos;
	this.ypos = data.ypos;
};

Player.prototype.updatePlayerCookie = function() {
	if(this.id == playerID) {
		$.cookie('player', this.id);
		$.cookie('x', this.x);
		$.cookie('y', this.y);
		$.cookie('xpos', this.xpos);
		$.cookie('ypos', this.ypos);
	}
}