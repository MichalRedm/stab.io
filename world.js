class World {
    constructor() {
        var d = new Date();
        this.startTime = d.getTime();
        this.players = {};
    }
    addPlayer(player, id) {
        this.players[id] = player;
    }
}

module.exports = World;