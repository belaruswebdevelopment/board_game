const {Server} = require('boardgame.io/server');
const {BoardGame} = require('./Game');

const server = Server({
    games: [BoardGame],
});

server.run(8000);
