/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	remotePlayers,	// Remote players
	remoteBullets,
	socket;			// Socket connection


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("battlefield");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = constants.BATTLEFIELD_WIDTH;
	canvas.height = constants.BATTLEFIELD_HEIGHT;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));

	// Initialise the local player
	localPlayer = new Player(startX, startY);
	console.log('localPlayer.getRadius: '+localPlayer.getRadius());

	// Initialise socket connection
	//socket = io.connect("http://localhost", {port: 1253, transports: ["websocket"]});
	socket = io();

	// Initialise remote players array
	remotePlayers = [];

	// Initialise bullets array
	remoteBullets = [];
	
	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
	
	document.getElementById("battlefield").addEventListener("click", mouseFire, false);

	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);

	// Bullets update message received
	socket.on("update bullets", onUpdateBullets);
};

//for absolute element position
function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        return getOffsetRect(elem);
    } else {
        return getOffsetSum(elem);
    }
}

function getOffsetSum(elem) {
    var top=0, left=0;
    while(elem) {
        top = top + parseInt(elem.offsetTop);
        left = left + parseInt(elem.offsetLeft);
        elem = elem.offsetParent;
    }

    return {top: top, left: left};
}

function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect();

    // (2)
    var body = document.body;
    var docElem = document.documentElement;

    // (3)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    // (4)
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    // (5)
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}


// Keyboard key down
function onKeydown(e) {
	var c = e.keyCode;
	
	if (localPlayer) {
		keys.onKeyDown(e);
		
		switch (c){
			// Fire
			case 32: // backspace				
				fire();
				break;
			default:
				console.log('keydown: '+c);
				break;
			
		};
	};
};

// Keyboard key up
function onKeyup(e) {
	var c = e.keyCode;
	
	if (localPlayer) {
		keys.onKeyUp(e);
		
	};
};

function mouseFire(event){

    //field coordinate
	var fieldcoord = getOffset(document.getElementById('battlefield'));

	//launcher
	var launcherX = localPlayer.getX()+fieldcoord.left;
	var launcherY = localPlayer.getY()+ fieldcoord.top;
	
	//target
	var targetX = event.pageX;
	var targetY = event.pageY;
	
	var relativeX = targetX - launcherX;
    var relativeY = targetY - launcherY;
 
    var radians = Math.atan2(relativeY, relativeX);
 
    console.log('launch new bullet with x: ' + localPlayer.getX() + ' y: ' + localPlayer.getY() + ' radians: ' + radians);

	// Send new bullet data to the game server  
	socket.emit("new bullet", {x: localPlayer.getX(), y: localPlayer.getY(), radians: radians});
    	    
	//console.log('fire from: absX:'+(localPlayer.getX()+fieldcoord.left)+' absY: '+(localPlayer.getY()+ fieldcoord.top));
    //var cX = event.clientX;
    //var cY = event.clientY;
    //console.log("to absX: " + cX + ", to absY: " + cY);
    //console.log("to absX2: " + event.pageX + ", to absY2: " + event.pageY);  
}

function fire(){
	var fieldcoord = getOffset(document.getElementById('battlefield'));
	
	console.log('fire from: absX:'+(localPlayer.getX()+fieldcoord.left)+' absY: '+(localPlayer.getY()+ fieldcoord.top));
	//console.log('fieldcoord.top: ' + fieldcoord.top + ' fieldcoord.left: '+fieldcoord.left);	
}

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	//canvas.width = 0.9*window.innerWidth;
	//canvas.height = 0.9*window.innerHeight;
	canvas.width = constants.BATTLEFIELD_WIDTH;
	canvas.height = constants.BATTLEFIELD_HEIGHT;	
	
};

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");
	//var os = require('os');
	//console.log("Connected"+ hostname());

	// Send local player data to the game server
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

// Update bullets
function onUpdateBullets(data) {
	//здесь убить все предыдущие пули
	remoteBullets=[];
	
	var bulletlist = JSON.parse(data);
	console.log(data);
	
	
	bulletlist.forEach(create_bullet);
	
	function create_bullet(bullet, i, bulletlist) {
		console.log('bullet x:'+ bullet.x + '; y: ' + bullet.y + '; author: ' + bullet.author);
		
		// Initialise the new bullet
		var newBullet = new Bullet(bullet.x, bullet.y);
		newBullet.author = bullet.author;

		// Add new player to the remote players array
		remoteBullets.push(newBullet);			
	}

	
	/*for (i in bulletlist){
		console.log('x: 'bulletlist[i].x + ' y: ' + bulletlist[i].y);
		//console.log('onUpdateBullets'+JSON.parse(data));
	};*/
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	// Update local player and check for change
	if (localPlayer.update(keys)) {
		// Send local player data to the game server
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	localPlayer.draw(ctx);

	// Draw the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx);
	};

	remoteBullets.forEach(draw_bullet);	
	function draw_bullet(bullet, i, remoteBullets) {
		bullet.draw(ctx);
	}
	
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};
