import { AddDataToLog, LogTypes } from "./Logging";
import { SuitNames, suitsConfig } from "./data/SuitData";
import { TotalRank } from "./helpers/ScoreHelpers";
import { DeckCardTypes, DistinctionTypes, MyGameState } from "./GameSetup";
import { Ctx } from "boardgame.io";

export interface IDistinctions {
    [index: string]: DistinctionTypes,
}

// todo Rework 2 functions in one?
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
 * @param suit Фракция.
 * @returns Индекс игрока с преимуществом по фракции, если имеется.
 */
export const CheckCurrentSuitDistinction = (G: MyGameState, ctx: Ctx, suit: string): DistinctionTypes => {
    const playersRanks: number[] = [];
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        playersRanks.push(G.publicPlayers[i].cards[suit].reduce(TotalRank, 0));
    }
    const max: number = Math.max(...playersRanks),
        maxPlayers: number[] = playersRanks.filter((count: number): boolean => count === max);
    if (maxPlayers.length === 1) {
        const playerDistinctionIndex: number = playersRanks.indexOf(maxPlayers[0]);
        AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} получил игрок: ${G.publicPlayers[playerDistinctionIndex].nickname}.`);
        return playerDistinctionIndex;
    } else {
        AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} никто не получил.`);
        return undefined;
    }
};

/**
 * <h3>Высчитывает наличие игроков с преимуществом по шевронам конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при подсчёте преимуществ по количеству шевронов фракции в конце игры (фракция воинов).</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @returns Индексы игроков с преимуществом по фракции.
 */
export const CheckCurrentSuitDistinctions = (G: MyGameState, ctx: Ctx, suit: string): number[] | undefined => {
    const playersRanks: number[] = [];
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        playersRanks.push(G.publicPlayers[i].cards[suit].reduce(TotalRank, 0));
    }
    const max: number = Math.max(...playersRanks),
        maxPlayers: number[] = playersRanks.filter((count: number): boolean => count === max),
        playerDistinctionIndex: number = playersRanks.indexOf(maxPlayers[0]);
    AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} получил игрок: ${G.publicPlayers[playerDistinctionIndex].nickname}.`);
    return maxPlayers;
};

/**
 * <h3>Подсчёт преимуществ по количеству шевронов фракций в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрабатывает в начале фазы получения преимуществ за количество шевронов каждой фракции.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckDistinction = (G: MyGameState, ctx: Ctx): void => {
    AddDataToLog(G, LogTypes.GAME, "Преимущество по фракциям в конце эпохи:");
    for (const suit in suitsConfig) {
        if (suitsConfig.hasOwnProperty(suit)) {
            const result: DistinctionTypes = CheckCurrentSuitDistinction(G, ctx, suit);
            G.distinctions[suit] = result;
            if (suit === SuitNames.EXPLORER && result === undefined) {
                const discardedCard: DeckCardTypes = G.decks[1].splice(0, 1)[0];
                G.discardCardsDeck.push(discardedCard);
                AddDataToLog(G, LogTypes.PRIVATE, `Из-за отсутствия преимущества по фракции разведчиков сброшена карта: ${discardedCard.name}.`);
            }
        }
    }
};
