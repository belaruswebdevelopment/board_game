import React from 'react';
import {Client} from 'boardgame.io/react';
import {Local} from 'boardgame.io/multiplayer';
import {MCTSBot, RandomBot} from 'boardgame.io/ai';
import {BoardGame} from './Game';
import {GameBoard} from './Board';

class CustomMCTSBot extends MCTSBot {
  constructor(config, ...args) {
    super({
        ...config,
        //objectives: { /* ... */ },
        iterations: 500,
        playoutDepth: 100,
      },
      ...args
    );
  }
}

const enableLocalPlayer = false;
const setupBot = {bots: {
    '0': CustomMCTSBot,
    '1': RandomBot,
    },
};

const BoardGameClient = Client({
    game: BoardGame,
    board: GameBoard,
    numPlayers: 3,
});

const App = () => (
  <div>
    <BoardGameClient />
  </div>
);

export default App;
