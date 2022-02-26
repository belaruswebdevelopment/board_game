import { Ctx } from "boardgame.io";
import { suitsConfig } from "./data/SuitData";
import { AddDataToLog } from "./Logging";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { LogTypes, SuitNames } from "./typescript/enums";
import { DeckCardTypes, DistinctionTypes, IMyGameState, SuitTypes } from "./typescript/interfaces";

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
export const CheckCurrentSuitDistinction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes): DistinctionTypes | never => {
    const playersRanks: number[] = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        playersRanks.push(G.publicPlayers[i].cards[suit].reduce(TotalRank, 0));
    }
    const max: number = Math.max(...playersRanks);
    if (max !== 0) {
        const maxPlayers: number[] = playersRanks.filter((count: number): boolean => count === max);
        if (maxPlayers.length === 1) {
            const playerDistinctionIndex: number = playersRanks.indexOf(maxPlayers[0]);
            AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} получил игрок: ${G.publicPlayers[playerDistinctionIndex].nickname}.`);
            return String(playerDistinctionIndex);
        } else {
            AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} никто не получил.`);
            return undefined;
        }
    } else {
        throw new Error(`Должны быть карты во фракции ${suitsConfig[suit].suitName} хотя бы у 1 игрока.`);
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
export const CheckCurrentSuitDistinctions = (G: IMyGameState, ctx: Ctx, suit: SuitTypes): number[] | never => {
    const playersRanks: number[] = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        playersRanks.push(G.publicPlayers[i].cards[suit].reduce(TotalRank, 0));
    }
    const max: number = Math.max(...playersRanks);
    if (max !== 0) {
        const maxPlayers: number[] = [];
        playersRanks.forEach((value: number, index: number) => {
            if (value === max) {
                maxPlayers.push(index);
                AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} получил игрок: ${G.publicPlayers[index].nickname}.`);
            }
        });
        if (maxPlayers.length) {
            return maxPlayers;
        } else {
            throw new Error(`Преимущество по фракции ${suitsConfig[suit].suitName} должно быть хотя бы у 1 игрока.`);
        }
    } else {
        throw new Error(`Должны быть карты во фракции ${suitsConfig[suit].suitName} хотя бы у 1 игрока.`);
    }
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
export const CheckDistinction = (G: IMyGameState, ctx: Ctx): void => {
    AddDataToLog(G, LogTypes.GAME, `Преимущество по фракциям в конце эпохи:`);
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
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
