class Universe {
    constructor() {
        var d = new Date();
        this.startTime = d.getTime();
        this.worlds = [];
    }
    addWorld(world) {
        this.worlds.push(world);
    }
}

module.exports = Universe;