var express = require('express');
var app = express();
//var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var os = require('os');

// Routing
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(filedir + '/public/index.html');
});

http.listen(1253, function(){
  console.log('listening on *:1253; hostname: ' + os.hostname());
});

var constants = require(__dirname +'/public/js/constants.js');
//console.log('BATTLEFIELD_WIDTH: '+ consts.BATTLEFIELD_WIDTH);

//BATTLEFIELD
var BATTLEFIELD_WIDTH=constants.BATTLEFIELD_WIDTH;
var BATTLEFIELD_HEIGHT=constants.BATTLEFIELD_HEIGHT;

/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	//io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class
var Bullet = require("./Bullet").Bullet;

/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players,	// Array of connected players
	bullets;	// Array of bullets

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

	// Create an empty array to bullets
	bullets = [];
	var bullet_tracing=[];

	// Set up Socket.IO to listen on port 8000
	/*socket = io.listen(1253);*/
	
	/*socket.set('transports', [
    'websocket'
	]);*/

	//socket.set("log level", 2);

	// Configure Socket.IO
	/*socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});*/

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	io.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);
	//console.log("New player has connected: "+ JSON.stringify(client.handshake.headers));

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);

	// Listen for new bullets message
	client.on("new bullet", onNewBullet);
	
	//tracing();
	
	/*function tracing(){
		setTimeout(tracing, 200);
		// Broadcast updated bullets position to connected socket clients
		//this.broadcast.emit("update bullets", JSON.stringify(bullets));
		io.sockets.emit("update bullets", {id: 1});
		console.log("update bullets");

	}*/
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	};
		
	// Add new player to the players array
	players.push(newPlayer);
};

// New Bullet launch
function onNewBullet(data) {
	//console.log('new buller create');
	// Create a new Bullet
	var newBullet = new Bullet(data.x, data.y, data.radians);
	newBullet.author = this.id;
		
	// Add new bullet to the bullets array
	bullets.push(newBullet);
	//console.log(JSON.stringify(bullets));	
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};

function physics() {
	setTimeout(physics, 20);
	move_bullets();
}

function move_bullets(){
	//обнуляем трайсинг пуль
	bullet_tracing =[];
	
	//bullets physics
	for (var i = 0; i < bullets.length; i++) {
		
		//bullets[i].doStep();
		bullets[i].doStep();
		bullet_tracing.push({author: bullets[i].author, x: bullets[i].getX(), y: bullets[i].getY()});
		
		players.forEach(collision);
		function collision(player, j, players) {
				//console.log("player.getX(): "+ player.getX() + ' bullets[i].getX(): ' + bullets[i].getX());
			if(((player.getX() <= (bullets[i].getX()+10)) && (player.getX() >= (bullets[i].getX()-10))) &&
			   ((player.getY() <= (bullets[i].getY()+10)) && (player.getY() >= (bullets[i].getY()-10)))){
				   
				var d = new Date();
				console.log("попадание: "+d.getTime());
			};	
		}		
		//console.log('bullets[i].doStep: x: ' + ball.getX() + ' y: '+ ball.getY());		
	};	
}

	//tracing();
	
	function tracing(){
		setTimeout(tracing, 100);
		// Broadcast updated bullets position to connected socket clients
		//only if exist
		if (typeof bullet_tracing !== 'undefined' && bullet_tracing.length > 0) {
			io.sockets.emit("update bullets", JSON.stringify(bullet_tracing));    
		}
	}
/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();
physics();//like bullet moving
tracing();
