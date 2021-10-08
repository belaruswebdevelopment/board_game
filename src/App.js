/*import React from "react";
import {Client} from "boardgame.io/react";
import {Local} from "boardgame.io/multiplayer";
import {MCTSBot, RandomBot} from "boardgame.io/ai";
import {BoardGame} from "./Game";
import {GameBoard} from "./Board";

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
            // "0": RandomBot,
            // "1": RandomBot,
            // "2": RandomBot,
            // "3": RandomBot,
            // "4": RandomBot,
        },
    },
    BoardGameClient = Client({
        debug: true,
        game: BoardGame,
        board: GameBoard,
        numPlayers: 3,
        multiplayer: enableLocalPlayer ? Local(setupBot) : undefined,
    }),
    App = () => (
        <div>
        <BoardGameClient playerID="0"/>
        {/!*<BoardGameClient playerID="1"/>*!/}
        {/!*<BoardGameClient playerID="2"/>*!/}
        </div>
    );

export default App;*/

import {Client} from "boardgame.io/react";
import {BoardGame} from "./Game";
import {GameBoard} from "./Board";

const App = Client({
    // debug: false,
    game: BoardGame,
    board: GameBoard,
    numPlayers: 5,
});

export default App;

/*
import React from "react";
import { render } from "react-dom";
import {Client} from "boardgame.io/react";
import {BoardGame} from "./Game";
import {GameBoard} from "./Board";
import {SocketIO} from "boardgame.io/multiplayer";

const BoardGameClient = Client({
    // debug: false,
    game: BoardGame,
    board: GameBoard,
    numPlayers: 3,
    multiplayer: SocketIO({
        server: "localhost:8000",
    }),
});

class App extends React.Component {
    state = { playerID: null};

    render() {
        if (this.state.playerID === null) {
            return (
                <div>
                    <p>Play as</p>
                    <button onClick={() => this.setState({ playerID: "0" })}>
                        Player 1
                    </button>
                    <button onClick={() => this.setState({ playerID: "1" })}>
                        Player 2
                    </button>
                    <button onClick={() => this.setState({ playerID: "2" })}>
                        Player 3
                    </button>
                    {/!*<button onClick={() => this.setState({ playerID: "3" })}>
                        Player 4
                    </button>
                    <button onClick={() => this.setState({ playerID: "4" })}>
                        Player 5
                    </button>*!/}
                </div>
            );
        }
        return (
            <div>
                <BoardGameClient playerID={this.state.playerID} />
            </div>
        );
    }
}

render(<App />, document.getElementById("root"));

export default App;
*/
