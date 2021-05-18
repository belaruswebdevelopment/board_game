import {Client} from 'boardgame.io/react';
import {BoardGame} from './Game';
import {GameBoard} from './Board';

const App = Client({
    game: BoardGame,
    board: GameBoard,
    numPlayers: 3,
});

export default App;
