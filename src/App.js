/*
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

const enableLocalPlayer = true,
    setupBot = {
        bots: {
            '0': RandomBot,
            '1': RandomBot,
            '2': RandomBot,
            '3': RandomBot,
            // '4': RandomBot,
        },
    },
    BoardGameClient = Client({
        debug: false,
        game: BoardGame,
        board: GameBoard,
        numPlayers: 4,
        multiplayer: enableLocalPlayer ? Local(setupBot) : undefined,
    }),
    App = () => (
        <BoardGameClient playerID="3"/>
    );

export default App;
*/
import {Client} from 'boardgame.io/react';
import {BoardGame} from './Game';
import {GameBoard} from './Board';

const App = Client({
    game: BoardGame,
    board: GameBoard,
    numPlayers: 3,
});

export default App;
