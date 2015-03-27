/**************************************************
** GAME BULLET CLASS
**************************************************/
var Bullet = function(startX, startY, radians) {
	var x = startX,
		y = startY,
		radians = radians;
	
	var step = 2; //one 4 all - one speed for bullets
	var radius = 4;
	
	//delta individual (зависит от наклона)	
	var deltaX	= Math.cos(radians) * step;
	var deltaY = Math.sin(radians) * step;

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

	var doingStep = function(step) {
		
	};	

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getRadians: getRadians,
	}
};

// Export the Bullet class so you can use it in
// other files by using require("Bullet").Bullet
exports.Bullet = Bullet;
