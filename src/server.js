"use strict";
var Server = require('boardgame.io/server').Server;
var BoardGame = require('./Game').BoardGame;
var server = Server({
    games: [BoardGame]
});
server.run(8000);
