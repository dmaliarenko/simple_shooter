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
	this.emit("new id", {id: this.id});
	
	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

	// Send existing players to the new player
	var i, existingPlayer;
	var Player_deadlist = [];
	
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		if(existingPlayer.id != this.id){
			this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});		
		}else{
			//отметить на удаление все уже существующие в players
			 Player_deadlist.push(i);
		}
	};
	
	//удалить мертвых
	for (i = 0; i < Player_deadlist.length; i++) {
		players.splice(Player_deadlist[i], 1);
	}
	
	// Add new player to the players array
	players.push(newPlayer);
	
	/*var active_clients = [];
	for (i = 0; i < io.sockets.sockets.length; i++) {
		active_clients.push(io.sockets.sockets[i].id);
	};
	console.log('active_clients: ' + JSON.stringify(active_clients));
	
	//проверяем игроков - оставляем только активных
	players.forEach(face_control);
	function face_control(player, j, players) {
		if(active_clients.includes(player.id)){
			console.log(player.id + ' in game'); 
		}else{
			console.log(player.id + " not connected");
		}	
	}*/	
};

// New Bullet launch
function onNewBullet(data) {
	//console.log('new buller create');
	// Create a new Bullet
	var newBullet = new Bullet(data.x, data.y, data.radians);
	newBullet.author = this.id;
		
	// Add new bullet to the bullets array
	bullets.push(newBullet);
	tracing();
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
	setTimeout(physics, 15);
	move_bullets();
}

function move_bullets(){
	
	var dead_bullet_list = []; //лист с индексами пуль, которые должны быть уничтожены после поражения цели (удаление после прохождения цикла).
	
	//bullets physics
	for (var i = 0; i < bullets.length; i++) {
		
		//keep walking;
		bullets[i].doStep();
		
		players.forEach(collision);
		function collision(player, j, players) {
				
			//THIS IS GEOMETRY!!! :)
			//находим расстояние между центрами
			var d = Math.sqrt(Math.pow(Math.abs(player.getX() - bullets[i].getX()),2) + Math.pow(Math.abs(player.getY() - bullets[i].getY()),2));

			//находим расстояние при контакте
			var contact_d = player.getRadius() + bullets[i].getRadius();
									
			if( d <= contact_d){
				
				//for destroin bullet
				//здесь сразу нельзя убить пулю (нельзя просто удалить с массива - т.к. мы в цикле: во-первых надо пройтись по всем остальным игрокам и сравнить с bullets[i].getX() например, во-вторых, нам надо продолжать дальше цикл по bullets.length)
				
				//вносим пулю в список для уничтожения
				dead_bullet_list.push(i);
				
				//тут бы надо фиксировать death; suicide; frag
				if(player.id == bullets[i].author){
					//suicide
					io.sockets.emit("transform player", {id: player.id, status: 'suicide'});
					
					console.log('player: ' + player.id + ' suicide :(');				
				}else{
					io.sockets.emit("transform player", {id: bullets[i].author, status: 'frag'});
					io.sockets.emit("transform player", {id: player.id, status: 'death'});
					
					console.log('player: ' + bullets[i].author + ' get frag;');
					console.log('player: ' + player.id + ' get death;');			
				}
				
				//это удалить: чисто для тестирования
				//var d = new Date();
				//console.log("попадание: "+d.getTime());
			};	
		}				
		tracing();		
	};
	
	//exterminatus foreach bullet in dead_bullet_list
	dead_bullet_list.forEach(bullet_extermination);
	function bullet_extermination (item, n, dead_bullet_list){
		bullets.splice(item,1);
		tracing();
		io.sockets.emit("update bullets", JSON.stringify(bullet_tracing));		
	}
}

	//

	function tracing(){
		//обнуляем трайсинг пуль
		bullet_tracing = [];
				
		for (var i = 0; i < bullets.length; i++) {
			bullet_tracing.push({author: bullets[i].author, x: bullets[i].getX(), y: bullets[i].getY()});		
		};
		//io.sockets.emit("update bullets", JSON.stringify(bullet_tracing));
	}
	
	function update_tracing(){
		setTimeout(update_tracing, 60);
		tracing();
					
		// Broadcast updated bullets position to connected socket clients
		//only if exist
		if (typeof bullet_tracing !== 'undefined' && bullet_tracing.length > 0) {
					
			io.sockets.emit("update bullets", JSON.stringify(bullet_tracing));    
		}
		
		/*var active_clients = [];
		for (i = 0; i < io.sockets.sockets.length; i++) {
			active_clients.push(io.sockets.sockets.id);
		};*/
		
		//console.log('active_clients: ' + JSON.stringify(io.sockets.sockets, ["id"]));		
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
update_tracing();
