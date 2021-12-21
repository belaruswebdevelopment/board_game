import { Server } from 'boardgame.io/server';
import { BoardGame } from './Game';
const server = Server({
    games: [BoardGame],
});
server.run(8000);
