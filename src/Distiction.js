import {AddDataToLog} from "./Logging";
import {suitsConfig} from "./data/SuitData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {TotalRank} from "./helpers/ScoreHelpers";

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
export const CheckDistinction = (G, ctx) => {
    let i = 0;
    AddDataToLog(G, "game", "Преимущество по фракциям в конце эпохи:");
    for (const suit in suitsConfig) {
        const result = CheckCurrentSuitDistinction(G, ctx, suit);
        G.distinctions[i] = result;
        if (suit === "explorer" && result === undefined) {
            const discardedCard = G.decks[1].splice(0, 1)[0];
            AddDataToLog(G, "private", `Из-за отсутствия преимущества по фракции разведчиков сброшена карта: 
            ${discardedCard.name}.`);
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
 * @returns {undefined|number} Индекс игрока с преимуществом по шевронам конкретной фракции, если имеется.
 * @constructor
 */
export const CheckCurrentSuitDistinction = (G, ctx, suitName) => {
    const playersRanks = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const suitIndex = GetSuitIndexByName(suitName);
        playersRanks.push(G.publicPlayers[i].cards[suitIndex].reduce(TotalRank, 0));
    }
    const max = Math.max(...playersRanks),
        maxPlayers = playersRanks.filter(count => count === max);
    if (maxPlayers.length === 1) {
        const playerDistinctionIndex = playersRanks.indexOf(maxPlayers[0]);
        AddDataToLog(G, "public", `Преимущество по фракции ${suitsConfig[suitName].suitName} получил игрок: 
        ${G.publicPlayers[playerDistinctionIndex].nickname}.`);
        return playerDistinctionIndex;
    } else {
        AddDataToLog(G, "public", `Преимущество по фракции ${suitsConfig[suitName].suitName} никто не получил.`);
        return undefined;
    }
};
