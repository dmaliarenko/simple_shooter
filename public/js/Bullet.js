/**************************************************
** GAME BULLET CLASS
**************************************************/
var Bullet = function(startX, startY) {
	var x = startX,
		y = startY,
		
		author;
	
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
		//ctx.fillStyle="red";
		//ctx.fillRect(x-2, y-2, 4, 4);
		
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'red';
      ctx.stroke();
      ctx.closePath();
	
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		draw: draw,
		author:author
	}
};
