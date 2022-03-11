import { suitsConfig } from "./data/SuitData";
import { AddDataToLog } from "./Logging";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { LogTypes, SuitNames } from "./typescript/enums";
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
export const CheckCurrentSuitDistinction = (G, ctx, suit) => {
    const playersRanks = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI = G.publicPlayers[i];
        if (playerI !== undefined) {
            playersRanks.push(playerI.cards[suit].reduce(TotalRank, 0));
        }
        else {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
    }
    const max = Math.max(...playersRanks);
    if (max !== 0) {
        const maxPlayers = playersRanks.filter((count) => count === max);
        if (maxPlayers.length === 1) {
            const maxPlayerIndex = maxPlayers[0];
            if (maxPlayerIndex !== undefined) {
                const playerDistinctionIndex = playersRanks.indexOf(maxPlayerIndex), playerDist = G.publicPlayers[playerDistinctionIndex];
                if (playerDist !== undefined) {
                    AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} получил игрок: ${playerDist.nickname}.`);
                }
                else {
                    throw new Error(`В массиве игроков отсутствует игрок ${playerDistinctionIndex}.`);
                }
                return String(playerDistinctionIndex);
            }
            else {
                throw new Error(`Отсутствует игрок с максимальным количеством шевронов выбранной фракции ${suit}.`);
            }
        }
        else {
            AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} никто не получил.`);
            return undefined;
        }
    }
    else {
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
export const CheckCurrentSuitDistinctions = (G, ctx, suit) => {
    const playersRanks = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI = G.publicPlayers[i];
        if (playerI !== undefined) {
            playersRanks.push(playerI.cards[suit].reduce(TotalRank, 0));
        }
        else {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
        }
    }
    const max = Math.max(...playersRanks);
    if (max !== 0) {
        const maxPlayers = [];
        playersRanks.forEach((value, index) => {
            if (value === max) {
                maxPlayers.push(index);
                const playerIndex = G.publicPlayers[index];
                if (playerIndex !== undefined) {
                    AddDataToLog(G, LogTypes.PUBLIC, `Преимущество по фракции ${suitsConfig[suit].suitName} получил игрок: ${playerIndex.nickname}.`);
                }
                else {
                    throw new Error(`В массиве игроков отсутствует игрок ${index}.`);
                }
            }
        });
        if (maxPlayers.length) {
            return maxPlayers;
        }
        else {
            throw new Error(`Преимущество по фракции ${suitsConfig[suit].suitName} должно быть хотя бы у 1 игрока.`);
        }
    }
    else {
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
export const CheckDistinction = (G, ctx) => {
    AddDataToLog(G, LogTypes.GAME, `Преимущество по фракциям в конце эпохи:`);
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            const result = CheckCurrentSuitDistinction(G, ctx, suit);
            G.distinctions[suit] = result;
            if (suit === SuitNames.EXPLORER && result === undefined) {
                const deck1 = G.decks[1];
                if (deck1 !== undefined) {
                    const discardedCard = deck1.splice(0, 1)[0];
                    if (discardedCard !== undefined) {
                        G.discardCardsDeck.push(discardedCard);
                        AddDataToLog(G, LogTypes.PRIVATE, `Из-за отсутствия преимущества по фракции разведчиков сброшена карта: ${discardedCard.name}.`);
                    }
                    else {
                        throw new Error(`Отсутствует сбрасываемая карта из колоды 2 эпохи при отсутствии преимущества по фракции разведчиков.`);
                    }
                }
                else {
                    throw new Error(`В массиве дек арт отсутствует дека 2 эпохи.`);
                }
            }
        }
    }
};
//# sourceMappingURL=Distinction.js.map