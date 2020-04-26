const Settings = require("./settings");
let settings = new Settings();

class Player {
    constructor() {
        var d = new Date();
        this.startTime = d.getTime();
        this.angle = 0;
        this.position = { x: 100, y: 100 };
        this.lastUpdateTime = d.getTime();
    }
    update() {
        var d = new Date();
        var t = d.getTime();
        var newPositionX = this.position.x + Math.cos(this.angle) * 10 * (t - this.lastUpdateTime) / settings.stepTime;
        var newPositionY = this.position.y + Math.sin(this.angle) * 10 * (t - this.lastUpdateTime) / settings.stepTime;
        // circular arena
        var r = Math.sqrt(newPositionX * newPositionX + newPositionY * newPositionY);
        if (r <= settings.worldSize) {
            this.position = { x: newPositionX, y: newPositionY };
        } else {
            this.position = { x: newPositionX * settings.worldSize / r, y: newPositionY * settings.worldSize / r };
        }
        // square arena
        /*this.position.x = Math.abs(newPositionX) <= settings.worldSize ? newPositionX : this.position.x;
        this.position.y = Math.abs(newPositionY) <= settings.worldSize ? newPositionY : this.position.y;*/
        this.lastUpdateTime = t;
    }
}

module.exports = Player;