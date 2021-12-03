"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Game_1 = require("./Game");
var GameBoard_1 = require("./GameBoard");
var react_1 = require("boardgame.io/react");
var react_2 = __importDefault(require("react"));
var LobbyClient = function () { return react_2["default"].createElement(react_1.Lobby, { gameServer: "http://".concat(window.location.hostname, ":8000"), lobbyServer: "http://".concat(window.location.hostname, ":8000"), gameComponents: [{
            game: Game_1.BoardGame,
            board: GameBoard_1.GameBoard
        }] }); };
exports["default"] = LobbyClient;
