import { getViewport } from "./viewport.js";
import { Controls } from "./controls.js";

var cache = {};
var settings = {};
var socketID = 0;
const spawnscreen = document.getElementById("spawnscreen");

var socket = io();
socket.on('message', function(data) {
    console.log(data);
});

let controls = new Controls();

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37: // left arrow
            controls.left = true;
            break;
        case 39: // right arrow
            controls.right = true;
            break;
        case 65: // A
            controls.left = true;
            break;
        case 68: // D
            controls.right = true;
            break;
        case 83: // S
            controls.boost = true;
            break;
        case 32: // space
            controls.boost = true;
            break;
    }
});
document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
        case 37: // left arrow
            controls.left = false;
            break;
        case 39: // right arrow
            controls.right = false;
            break;
        case 65: // A
            controls.left = false;
            break;
        case 68: // D
            controls.right = false;
            break;
        case 83: // S
            controls.boost = false;
            break;
        case 32: // space
            controls.boost = false;
            break;
    }
});

document.getElementById("spawnButton").addEventListener("click", function(){
    var name = document.getElementById("nameInput").value;
    socket.emit('spawn', {
        name: name,
        color: "red"
    });
    console.log("Spawned.");
    spawnscreen.style.display = "none";
});

socket.on("connectResponse", function(data) {
    console.log("Connected to an arena.");
    settings = data.settings;
    socketID = data.id;
    setInterval(function() {
        socket.emit('controls', controls);
    }, settings.stepTime);
});

var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
socket.on('state', function(cacheNew) {
    cache = cacheNew;
    draw();
});

window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(); 
});

var cameraPosition = { x: 0, y: 0 };
const img = document.getElementById("bgimg");
const ship = document.getElementById("atlas");
const leaderboard = document.getElementById("leaderboardTable");
const bgSpeed = 1;
const bgScale = 1;

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var id in cache) { if (id == socketID) { cameraPosition = cache[id].position; } }
    context.beginPath();
    context.arc(window.innerWidth/2 - cameraPosition.x, window.innerHeight/2 - cameraPosition.y, settings.worldSize, 0, 2 * Math.PI);
    context.translate(-cameraPosition.x * bgSpeed, -cameraPosition.y * bgSpeed);
    context.scale(bgScale, bgScale);
    context.fillStyle = context.createPattern(img, "repeat");;
    context.fill();
    context.scale(1/bgScale, 1/bgScale);
    context.translate(cameraPosition.x * bgSpeed, cameraPosition.y * bgSpeed);
    context.strokeStyle = "#0055ff";
    context.lineWidth = 20;
    context.stroke();
    leaderboard.innerHTML = "";
    for (var id in cache) {
        var player = cache[id];
        leaderboard.innerHTML += "<tr><td>" + player.name + "</td><td>" + player.score + "</td></tr>";
        context.drawImage(ship, player.position.x + window.innerWidth/2 - cameraPosition.x - 64, player.position.y + window.innerHeight/2 - cameraPosition.y - 64, 128, 128);
        context.font = "20px Exo2";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.strokeStyle = "#000000";
        context.shadowBlur = 4;
        context.lineWidth = 4;
        context.strokeText(player.name, player.position.x + window.innerWidth/2 - cameraPosition.x, player.position.y + window.innerHeight/2 - cameraPosition.y);
        context.shadowBlur = 0;
        context.fillStyle = "#ffffff";
        context.fillText(player.name, player.position.x + window.innerWidth/2 - cameraPosition.x, player.position.y + window.innerHeight/2 - cameraPosition.y);
    }
}