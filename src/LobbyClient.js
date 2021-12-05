import { jsx as _jsx } from "react/jsx-runtime";
import { BoardGame } from "./Game";
import { GameBoard } from "./GameBoard";
import { Lobby } from 'boardgame.io/react';
var LobbyClient = function () { return _jsx(Lobby, { gameServer: "http://".concat(window.location.hostname, ":8000"), lobbyServer: "http://".concat(window.location.hostname, ":8000"), gameComponents: [{
            game: BoardGame,
            board: GameBoard,
        }] }, void 0); };
export default LobbyClient;
