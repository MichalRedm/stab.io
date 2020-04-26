import { getViewport } from "./viewport.js";
import { Controls } from "./controls.js";

var cache = {};

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
    }
});

socket.emit('spawn');
setInterval(function() {
    socket.emit('controls', controls);
}, 20);

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

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'green';
    for (var id in cache) {
        var player = cache[id];
        context.beginPath();
        context.arc(player.position.x, player.position.y, 10, 0, 2 * Math.PI);
        context.fill();
    }
}