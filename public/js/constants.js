/**************************************************
** GAME CONSTANTS
**************************************************/

(function(exports){

//code for client (browser) side

	//BATTLEFIELD
 	var BATTLEFIELD_WIDTH = 900;
	var BATTLEFIELD_HEIGHT = 500;
	
	//BULLET
	var BULLET_RADIUS =  2;
	var BULLET_STEP = 15;
	
	//PLAYER
	var PLAYER_RADIUS = 30; //default
	 

//code for server side
	//BATTLEFIELD
	exports.BATTLEFIELD_WIDTH = BATTLEFIELD_WIDTH;
	exports.BATTLEFIELD_HEIGHT = BATTLEFIELD_HEIGHT;
	
	//BULLET
	exports.BULLET_RADIUS = BULLET_RADIUS;
	exports.BULLET_STEP = BULLET_STEP;
	
	//PLAYER
	exports.PLAYER_RADIUS = PLAYER_RADIUS;
	
})(typeof exports === 'undefined'? this['constants']={}: exports);
