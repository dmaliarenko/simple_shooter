/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		score = {},
		radius = constants.PLAYER_RADIUS, //default radius
		moveAmount = 4;
	
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
		console.log("score['suicide']" + score['suicide']);
		console.log('local player JSON.stringify(score): ' + JSON.stringify(score));
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

	/*var setSuicide = function(data) {
		suicide = data +0;
	};

	var setDeath = function(data) {
		death = data+0;
	};

	var setFrag = function(data) {
		frag = data+0;
	};*/
	
	var setScore= function(data) {
		console.log('new player setScore data' + data);	
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
	
	// Update player position
	var update = function(keys,remotePlayers) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
					
			if(y-radius-moveAmount >= 0){
				y -= moveAmount;			
			}else{
				//console.log('outer field');
			}
			
		} else if (keys.down) {
						
			if(y+radius+moveAmount <= constants.BATTLEFIELD_HEIGHT){
				y += moveAmount;			
			}else{
				//console.log('outer field');
			}
		};

		// Left key takes priority over right
		if (keys.left) {
			
			if(x-radius-moveAmount >= 0){
				x -= moveAmount;			
			}else{
				//console.log('outer field');
			}
			
		} else if (keys.right) {
						
			if(x+radius+moveAmount <= constants.BATTLEFIELD_WIDTH){
				x += moveAmount;			
			}else{
				//console.log('outer field');
			}
		};
		
		
		//ищем столкновение с коллегами
		remotePlayers.forEach(collision);
		function collision(remotePlayer, j, remotePlayers) {
				
			//THIS IS GEOMETRY!!! :)
			//находим расстояние между центрами
			var d = Math.sqrt(Math.pow(Math.abs(remotePlayer.getX() - x),2) + Math.pow(Math.abs(remotePlayer.getY() - y),2));

			//находим расстояние при контакте
			var contact_d = remotePlayer.getRadius() + radius;
									
			if( d < contact_d){
				//отменяем ход
				x = prevX;
				y = prevY;
				//хотя тут можно откорректировать ход точно до контакта
			};	
		}		

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		ctx.beginPath();	
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
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

		
		updateScore:updateScore,
		update: update,
		draw: draw
	}
};
