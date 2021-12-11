import {AddDataToLog, LogTypes} from "./Logging";
import {SuitNames, suitsConfig} from "./data/SuitData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {TotalRank} from "./helpers/ScoreHelpers";
import {DeckCardTypes, DistinctionTypes, MyGameState} from "./GameSetup";
import {Ctx} from "boardgame.io";

/**
 * <h3>Подсчёт преимуществ по количеству шевронов фракций в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрабатывает в начале фазы получения преимуществ за количество шевронов каждой фракции.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export const CheckDistinction = (G: MyGameState, ctx: Ctx): void => {
    let i: number = 0;
    AddDataToLog(G, LogTypes.GAME, "Преимущество по фракциям в конце эпохи:");
    for (const suit in suitsConfig) {
        const result: DistinctionTypes = CheckCurrentSuitDistinction(G, ctx, suit);
        G.distinctions[i] = result;
        if (suit === SuitNames.EXPLORER && result === undefined) {
            const discardedCard: DeckCardTypes = G.decks[1].splice(0, 1)[0];
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {string} suitName Фракция.
 * @returns {number | undefined} Индекс игрока с преимуществом по фракции, если имеется.
 * @constructor
 */
export const CheckCurrentSuitDistinction = (G: MyGameState, ctx: Ctx, suitName: string): number | undefined => {
    const playersRanks: number[] = [],
        suitIndex: number = GetSuitIndexByName(suitName);
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        playersRanks.push(G.publicPlayers[i].cards[suitIndex].reduce(TotalRank, 0));
    }
    const max: number = Math.max(...playersRanks),
        maxPlayers: number[] = playersRanks.filter((count: number): boolean => count === max);
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
