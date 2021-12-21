import { jsx as _jsx } from "react/jsx-runtime";
import { BoardGame } from "./Game";
import { GameBoard } from "./GameBoard";
import { Lobby } from 'boardgame.io/react';
const LobbyClient = () => _jsx(Lobby, { gameServer: `http://${window.location.hostname}:8000`, lobbyServer: `http://${window.location.hostname}:8000`, gameComponents: [{
            game: BoardGame,
            board: GameBoard,
        }] }, void 0);
export default LobbyClient;
