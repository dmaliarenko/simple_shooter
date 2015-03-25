/**************************************************
** GAME BULLET CLASS
**************************************************/
var Bullet = function(startX, startY, targetX, targetY) {
	var x = startX,
		y = startY,
		
		sx = startX,
		sy = startY,
		tx = targetX,
		ty = targetY,
		
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



	// Draw bullet
	var draw = function(ctx) {
		ctx.fillStyle="#FF0000";
		ctx.fillRect(x-2, y-2, 4, 4);
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		draw: draw
	}
};
