import { Server } from 'boardgame.io/server';
import { BoardGame } from './Game';

/**
 * <h3>Сервер игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При использовании мультиплеера.</li>
 * </ol>
 */
const server = Server({
    games: [BoardGame],
});

server.run(8000);
