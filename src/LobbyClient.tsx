import { BoardGame } from "./Game";
import { GameBoard } from "./GameBoard";
import { Lobby } from 'boardgame.io/react';

const LobbyClient = (): JSX.Element => <Lobby
    gameServer={`http://${window.location.hostname}:8000`}
    lobbyServer={`http://${window.location.hostname}:8000`}
    gameComponents={
        [{
            game: BoardGame,
            board: GameBoard,
        }]
    }
/>

export default LobbyClient;
