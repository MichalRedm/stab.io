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
        this.position.x += Math.cos(this.angle) * 10 * (t - this.lastUpdateTime) / 20;
        this.position.y += Math.sin(this.angle) * 10 * (t - this.lastUpdateTime) / 20;
        this.lastUpdateTime = t;
    }
}

module.exports = Player;