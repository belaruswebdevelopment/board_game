"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
var GameBoard_1 = require("./GameBoard");
var react_1 = require("boardgame.io/react");
var react_2 = require("react");
var LobbyClient = function () {
    return <react_1.Lobby gameServer={"http://" + window.location.hostname + ":8000"} lobbyServer={"http://" + window.location.hostname + ":8000"} gameComponents={[{
                game: Game_1.BoardGame,
                board: GameBoard_1.GameBoard,
            }]}/>;
};
exports.default = LobbyClient;
