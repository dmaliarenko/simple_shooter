/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	//подключаем константы
	var constants = require(__dirname +'/public/js/constants.js');
	
	var x = startX,
		y = startY,
		id,
		score ={},
		
		radius = constants.PLAYER_RADIUS; //default radius
		
	score.suicide = 0;
	score.death	= 0;
	score.frag	= 0;

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
	
	var getScore = function() {
		console.log("server score['suicide']" + score['suicide']);
		console.log('server player JSON.stringify(score): ' + JSON.stringify(score));
		return JSON.stringify(score);
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
	
	var setScore= function(data) {
		console.log('setScore data: ' + data);	
		score= JSON.parse(data);

	};
	
	var updateScore = function(data) {
		switch (data) {
			case 'suicide':
				score.suicide = score.suicide + 1;
				setRadius(radius-1);
				break;
			case 'death':
				score.death = score.death + 1;
				setRadius(radius-1);
				break;
			case 'frag':
				score.frag = score.frag + 1;
				setRadius(radius+1);
				break;
		}
	};
	
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getRadius: getRadius,
		getScore: getScore,
		
		setX: setX,
		setY: setY,
		setRadius: setRadius,
		setScore: setScore,
		updateScore: updateScore,
		
		id: id
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;
