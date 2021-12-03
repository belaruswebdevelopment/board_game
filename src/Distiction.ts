import {AddDataToLog, LogTypes} from "./Logging";
import {suitsConfig} from "./data/SuitData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {TotalRank} from "./helpers/ScoreHelpers";
import {MyGameState} from "./GameSetup";
import {Ctx} from "boardgame.io";
import {IActionCard, ICard} from "./Card";

/**
 * <h3>Подсчёт преимуществ по количеству шевронов фракций в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрабатывает в начале фазы получения преимуществ за количество шевронов каждой фракции.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
export const CheckDistinction = (G: MyGameState, ctx: Ctx): void => {
    let i: number = 0;
    AddDataToLog(G, LogTypes.GAME, "Преимущество по фракциям в конце эпохи:");
    for (const suit in suitsConfig) {
        const result: number | undefined = CheckCurrentSuitDistinction(G, ctx, suit);
        G.distinctions[i] = result;
        if (suit === "explorer" && result === undefined) {
            const discardedCard: ICard | IActionCard = G.decks[1].splice(0, 1)[0];
            AddDataToLog(G, LogTypes.PRIVATE, `Из-за отсутствия преимущества по фракции разведчиков 
            сброшена карта: ${discardedCard.name}.`);
        }
        i++;
    }
};

/**
 * <h3>Высчитывает наличие игрока с преимуществом по шевронам конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется в подсчёте преимуществ по количеству шевронов фракций в конце эпохи.</li>
 * <li>Применяется при подсчёте преимуществ по количеству шевронов фракции в конце игры (фракция воинов).</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suitName Фракция.
 * @constructor
 */
export const CheckCurrentSuitDistinction = (G: MyGameState, ctx: Ctx, suitName: string): number | undefined => {
    const playersRanks: number[] = [];
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        const suitIndex: number = GetSuitIndexByName(suitName);
        playersRanks.push(G.publicPlayers[i].cards[suitIndex].reduce(TotalRank, 0));
    }
    const max: number = Math.max(...playersRanks),
        maxPlayers: number[] = playersRanks.filter(count => count === max);
    if (maxPlayers.length === 1) {
        const playerDistinctionIndex: number = playersRanks.indexOf(maxPlayers[0]);
        AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suitName].suitName} получил 
        игрок: ${G.publicPlayers[playerDistinctionIndex].nickname}.`);
        return playerDistinctionIndex;
    } else {
        AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suitName].suitName} никто 
        не получил.`);
        return undefined;
    }
};
