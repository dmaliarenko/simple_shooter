/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	//подключаем константы
	var constants = require(__dirname +'/public/js/constants.js');
	
	var x = startX,
		y = startY,
		id,
		
		suicide = 0, death = 0, frag = 0, //status
		
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
	
	var getStatus = function() {
		return {suicide: suicide, death: death, frag: frag};
	};
				
	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setRadius = function(newRadius) {
		if(newRadius <= constants.PLAYER_maxRADIUS && newRadius >= constants.PLAYER_minRADIUS){
			radius = newRadius;			
		}
	};
	
	var setStatus= function(status) {
		suicide = status.suicide;
		death = status.death;
		frag =status.frag;
	};
	
	var updateStatus = function(status) {
		switch (status) {
			case 'suicide':
				suicide++;
				setRadius(getRadius()-1);
				break;
			case 'death':
				death++;
				setRadius(getRadius()-1);
				break;
			case 'frag':
				frag++;
				setRadius(getRadius()+1);
				break;
		}
	};
	
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getRadius: getRadius,
		getStatus: getStatus,
		
		setX: setX,
		setY: setY,
		setRadius: setRadius,
		setStatus: setStatus,
		updateStatus: updateStatus,
		
		id: id
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;
