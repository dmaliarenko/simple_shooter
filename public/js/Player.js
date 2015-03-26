/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		moveAmount = 2;
	
	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
					
			if(y-moveAmount >= 0){
				y -= moveAmount;			
			}else{
				//console.log('outer field');
			}
			
		} else if (keys.down) {
						
			if(y+moveAmount <= BATTLEFIELD_HEIGHT){
				y += moveAmount;			
			}else{
				//console.log('outer field');
			}
		};

		// Left key takes priority over right
		if (keys.left) {
			
			if(x-moveAmount >= 0){
				x -= moveAmount;			
			}else{
				//console.log('outer field');
			}
			
		} else if (keys.right) {
						
			if(x+moveAmount <= BATTLEFIELD_WIDTH){
				x += moveAmount;			
			}else{
				//console.log('outer field');
			}
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		ctx.fillRect(x-5, y-5, 10, 10);
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		draw: draw
	}
};
