const Universe = require("./universe");
const World = require("./world");
const Player = require("./player");
const Settings = require("./settings");

let universe = new Universe();
let settings = new Settings();

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function() {
    console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});

/*
setInterval(function() {
    io.sockets.emit('message', 'test');
}, 1000);
*/

let world = new World();
universe.addWorld(world);

io.on('connection', function(socket) {
    socket.on('spawn', function() {
        var player = new Player();
        universe.worlds[0].addPlayer(player, socket.id);
    });
    socket.on('controls', function(data) {
        var player = universe.worlds[0].players[socket.id];
        if (data.left) {
            player.angle -= 2 * Math.PI * settings.rotationSpeed;
        }
        if (data.right) {
            player.angle += 2 * Math.PI * settings.rotationSpeed;
        }
    });
});

setInterval(function() {
    for (var id in universe.worlds[0].players) {
        universe.worlds[0].players[id].update();
    }
    io.sockets.emit('state', universe.worlds[0].players);
}, settings.stepTime);