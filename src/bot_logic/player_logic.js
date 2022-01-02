import { CurrentScoring } from "../Score";
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param playerId Id игрока.
 * @returns
 */
export const IsTopPlayer = (G, playerId) => G.publicPlayers.every((player) => CurrentScoring(player) <= CurrentScoring(G.publicPlayers[playerId]));
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров
 * @param G
 * @param currentPlayerId Id текущего игрока.
 * @returns
 */
/*export const GetTop1PlayerId = (G: MyGameState, currentPlayerId: number): number => {
    let top1PlayerId: number =
    G.publicPlayers.findIndex((player: IPublicPlayer, index: number): boolean => IsTopPlayer(G, index));
    if (G.publicPlayersOrder.indexOf(currentPlayerId) > G.publicPlayersOrder.indexOf(top1PlayerId)) {
        top1PlayerId = -1;
    }
    return top1PlayerId;
};*/
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param top1PlayerId Id текущего игрока.
 * @returns
 */
/*export const GetTop2PlayerId = (G: MyGameState, top1PlayerId: number): number => {
    const playersScore: number[] = G.publicPlayers.map((player: IPublicPlayer): number => CurrentScoring(player)),
        maxScore: number = Math.max(...playersScore);
    let top2PlayerId: number,
        temp: number;
    if (playersScore.filter((score: number): boolean => score === maxScore).length === 1) {
        temp = playersScore.sort((a: number, b: number): number => b - a)[1];
        top2PlayerId = G.publicPlayers.findIndex((player: IPublicPlayer): boolean => CurrentScoring(player) === temp);
    } else {
        top2PlayerId = G.publicPlayers.findIndex((player: IPublicPlayer, index: number): boolean =>
        index !== top1PlayerId && IsTopPlayer(G, index));
    }
    if (G.publicPlayersOrder.indexOf(top1PlayerId) > G.publicPlayersOrder.indexOf(top2PlayerId)) {
        top2PlayerId = -1;
    }
    return top2PlayerId;
};*/
