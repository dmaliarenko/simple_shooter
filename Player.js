/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	//подключаем константы
	var constants = require(__dirname +'/public/js/constants.js');
	
	var x = startX,
		y = startY,
		id,
		radius = constants.PLAYER_RADIUS; //default radius

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
		radius = newRadius;
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getRadius: getRadius,
		
		setX: setX,
		setY: setY,
		setRadius: setRadius,
		
		id: id
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;
