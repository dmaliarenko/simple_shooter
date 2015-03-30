/**************************************************
** GAME BULLET CLASS
**************************************************/
var Bullet = function(startX, startY, radians) {
	
	var constants = require(__dirname +'/public/js/constants.js');
	//console.log('BATTLEFIELD_WIDTH: '+ constants.BATTLEFIELD_WIDTH);
	
	var x = startX,
		y = startY,
		traceX = x, //detection x ~ real x
		traceY = y, //detection y ~ real y
		
		radians = radians,
		radius = constants.BULLET_RADIUS,
		traceRadius = radius,
		author;
		
		
	
	var step = constants.BULLET_STEP; //one 4 all - one speed for bullets
	var radius = constants.BULLET_RADIUS;
	
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
	
	var getRadians = function() {
		return radians;
	};	
	
	var getRadius = function() {
		return radius;
	};

	var setRadius = function(newRadius) {
		radius = newRadius;
	};
	
	var doStep = function() {
		x += deltaX;
		y += deltaY;

		//collision
		if (x < radius) {
			deltaX = -deltaX;
			x = 2 * (radius) - x;
		} else if (x > constants.BATTLEFIELD_WIDTH - radius) {
			deltaX = -deltaX;
			x = 2 * (constants.BATTLEFIELD_WIDTH - radius) - x;
		}
		if (y < radius) {
			deltaY = -deltaY;
			y = 2 * (radius) - y;
		} else if (y > constants.BATTLEFIELD_HEIGHT - radius) {
			deltaY = -deltaY;
			y = 2 * (constants.BATTLEFIELD_HEIGHT - radius) - y;
		}
		
		//просчет движения пуль производится чаще, чем отправка видимости (трассировки) [отдельный массив] поэтому разделяю. хотя наверное можно и прямо 
		traceX = x;
		traceY = y;
				
	};	

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getRadians: getRadians,//надо, например, для расчета точки соприкосновения с игроком
		
		getRadius: getRadius,
		setRadius: setRadius,
		
		author: author,
		traceX: traceX,
		traceY: traceY,
		traceRadius: traceRadius,
		doStep: doStep
	}
};

// Export the Bullet class so you can use it in
// other files by using require("Bullet").Bullet
exports.Bullet = Bullet;
