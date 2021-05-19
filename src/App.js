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
        objectives: BoardGame.ai.objectives,
        iterations: BoardGame.ai.iterations,
        playoutDepth: BoardGame.ai.playoutDepth,
      },
      ...args
    );
  }
}

const enableLocalPlayer = true;
const setupBot = {bots: {
    '0': CustomMCTSBot,
    '1': RandomBot,
    },
};

const BoardGameClient = Client({
    game: BoardGame,
    board: GameBoard,
    numPlayers: 3,
    multiplayer: enableLocalPlayer ? Local(setupBot) : undefined,
});

const App = () => (
  <div>
    <BoardGameClient playerID = "2"/>
  </div>
);

export default App;
