import { Client } from 'boardgame.io/react';
import { BoardGame } from './Game';
import { GameBoard } from './Board';

const App = Client({
  game: BoardGame,
  board: GameBoard,
  numPlayers: 5,
});

export default App;