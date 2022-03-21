import { Lobby } from 'boardgame.io/react';
import { BoardGame } from "./Game";
import { GameBoard } from "./GameBoard";

/**
 * <h3>Лобби игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При использовании лобби в игре.</li>
 * </ol>
 *
 * @returns Клиент лобби.
 */
const LobbyClient = (): JSX.Element => <Lobby
    debug={true}
    gameServer={`http://${window.location.hostname}:8000`}
    lobbyServer={`http://${window.location.hostname}:8000`}
    gameComponents={
        [{
            game: BoardGame,
            board: GameBoard,
        }]
    }
/>;

export default LobbyClient;
