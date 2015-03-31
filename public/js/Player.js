/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		radius = constants.PLAYER_RADIUS, //default radius
		moveAmount = 5;
	
	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};
	
	var getRadius = function() {
		return radius;
	};
	
	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setRadius = function(newRadius) {
		if(newRadius <= PLAYER_maxRADIUS && newRadius >= PLAYER_minRADIUS){
			radius = newRadius;			
		}
	};
	
	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
					
			if(y-radius-moveAmount >= 0){
				y -= moveAmount;			
			}else{
				//console.log('outer field');
			}
			
		} else if (keys.down) {
						
			if(y+radius+moveAmount <= constants.BATTLEFIELD_HEIGHT){
				y += moveAmount;			
			}else{
				//console.log('outer field');
			}
		};

		// Left key takes priority over right
		if (keys.left) {
			
			if(x-radius-moveAmount >= 0){
				x -= moveAmount;			
			}else{
				//console.log('outer field');
			}
			
		} else if (keys.right) {
						
			if(x+radius+moveAmount <= constants.BATTLEFIELD_WIDTH){
				x += moveAmount;			
			}else{
				//console.log('outer field');
			}
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		ctx.beginPath();	
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getRadius: getRadius,
		setX: setX,
		setY: setY,
		setRadius: setRadius,
		update: update,
		draw: draw
	}
};
