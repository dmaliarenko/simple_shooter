/**************************************************
** GAME CONSTANTS
**************************************************/

(function(exports){

    //code for client (browser) side  
 	var BATTLEFIELD_WIDTH = 900;
	var BATTLEFIELD_HEIGHT = 500;
	var BULLET_RADIUS =  4;
	var BULLET_STEP = 2;  

	//code for server side
	exports.BATTLEFIELD_WIDTH = BATTLEFIELD_WIDTH;
	exports.BATTLEFIELD_HEIGHT = BATTLEFIELD_HEIGHT;
	exports.BULLET_RADIUS = BULLET_RADIUS;
	exports.BULLET_STEP = BULLET_STEP;
	
})(typeof exports === 'undefined'? this['constants']={}: exports);
