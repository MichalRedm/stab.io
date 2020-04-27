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
var ctx = canvas.getContext('2d');
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var id in cache) { if (id == socketID) { cameraPosition = cache[id].position; } }
    ctx.beginPath();
    ctx.arc(window.innerWidth/2 - cameraPosition.x, window.innerHeight/2 - cameraPosition.y, settings.worldSize, 0, 2 * Math.PI);
    ctx.translate(-cameraPosition.x * bgSpeed, -cameraPosition.y * bgSpeed);
    ctx.scale(bgScale, bgScale);
    ctx.fillStyle = ctx.createPattern(img, "repeat");;
    ctx.fill();
    ctx.scale(1/bgScale, 1/bgScale);
    ctx.translate(cameraPosition.x * bgSpeed, cameraPosition.y * bgSpeed);
    ctx.strokeStyle = "#0055ff";
    ctx.lineWidth = 20;
    ctx.stroke();
    leaderboard.innerHTML = "";
    for (var id in cache) {
        var player = cache[id];
        var coords = { x: player.position.x + window.innerWidth/2 - cameraPosition.x, y: player.position.y + window.innerHeight/2 - cameraPosition.y };
        leaderboard.innerHTML += "<tr><td>" + player.name + "</td><td>" + player.score + "</td></tr>";
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(coords.x + Math.cos(player.angle) * 200, coords.y + Math.sin(player.angle) * 200);
        ctx.stroke();
        ctx.drawImage(ship, coords.x - 64, coords.y - 64, 128, 128);
        ctx.font = "20px Exo2";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#000000";
        ctx.shadowBlur = 4;
        ctx.lineWidth = 4;
        ctx.strokeText(player.name, player.position.x + window.innerWidth/2 - cameraPosition.x, player.position.y + window.innerHeight/2 - cameraPosition.y);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(player.name, player.position.x + window.innerWidth/2 - cameraPosition.x, player.position.y + window.innerHeight/2 - cameraPosition.y);
    }
}