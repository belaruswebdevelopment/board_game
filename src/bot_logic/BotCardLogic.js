import { CreateCard, IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { GameNames } from "../typescript/enums";
// Check all types in this file!
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param card1 Первая карта.
 * @param card2 Вторая карта.
 * @returns Сравнительное значение.
 */
export const CompareCards = (card1, card2) => {
    var _a, _b;
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (IsCardNotActionAndNotNull(card1) && IsCardNotActionAndNotNull(card2)) {
        if (card1.suit === card2.suit) {
            const result = ((_a = card1.points) !== null && _a !== void 0 ? _a : 1) - ((_b = card2.points) !== null && _b !== void 0 ? _b : 1);
            if (result === 0) {
                return result;
            }
            return result > 0 ? 1 : -1;
        }
    }
    return 0;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @param compareCard Карта для сравнения.
 * @param cardId Id карты.
 * @param tavern Таверна.
 * @returns Сравнительное значение.
 */
export const EvaluateCard = (G, ctx, compareCard, cardId, tavern) => {
    if (IsCardNotActionAndNotNull(compareCard)) {
        const deckTier1 = G.decks[0];
        if (deckTier1 !== undefined) {
            if (deckTier1.length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
                return CompareCards(compareCard, G.averageCards[compareCard.suit]);
            }
        }
        else {
            throw new Error(`В массиве колод карт отсутствует колода 1 эпохи.`);
        }
    }
    const deckTier2 = G.decks[1];
    if (deckTier2 !== undefined) {
        if (deckTier2.length < G.botData.deckLength) {
            const temp = tavern.map((card) => G.publicPlayers.map((player) => PotentialScoring(player, card)));
            const tavernCardResults = temp[cardId];
            if (tavernCardResults !== undefined) {
                const result = tavernCardResults[Number(ctx.currentPlayer)];
                if (result !== undefined) {
                    temp.splice(cardId, 1);
                    temp.forEach((player) => player.splice(Number(ctx.currentPlayer), 1));
                    return result - Math.max(...temp.map((player) => Math.max(...player)));
                }
                else {
                    throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат для текущего игрока.`);
                }
            }
            else {
                throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат выбранной карты таверны для текущего игрока.`);
            }
        }
    }
    else {
        throw new Error(`В массиве колод карт отсутствует колода 2 эпохи.`);
    }
    if (IsCardNotActionAndNotNull(compareCard)) {
        return CompareCards(compareCard, G.averageCards[compareCard.suit]);
    }
    return 0;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param suitConfig Конфиг карт дворфов.
 * @param data ????????????????????????????????????????????????????????????????????
 * @returns "Средняя" карта дворфа.
 */
export const GetAverageSuitCard = (suitConfig, data) => {
    let totalPoints = 0;
    const pointsValuesPlayers = suitConfig.pointsValues()[data.players];
    if (pointsValuesPlayers !== undefined) {
        const points = pointsValuesPlayers[data.tier];
        if (points !== undefined) {
            const count = Array.isArray(points) ? points.length : points;
            for (let i = 0; i < count; i++) {
                if (Array.isArray(points)) {
                    const pointsValue = points[i];
                    if (pointsValue !== undefined) {
                        totalPoints += pointsValue;
                    }
                    else {
                        throw new Error(`Отсутствует значение ${i} в массиве карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
                    }
                }
                else {
                    totalPoints += 1;
                }
            }
            totalPoints /= count;
            return CreateCard({
                suit: suitConfig.suit,
                rank: 1,
                points: totalPoints,
                name: `Average card`,
                game: GameNames.Basic,
            });
        }
        else {
            throw new Error(`Отсутствует массив значений карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
        }
    }
    else {
        throw new Error(`Отсутствует массив значений карт для указанного числа игроков - '${data.players}'.`);
    }
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param player Игрок.
 * @param card Карта.
 * @returns Потенциальное значение.
 */
const PotentialScoring = (player, card) => {
    var _a, _b, _c;
    let score = 0, suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (IsCardNotActionAndNotNull(card) && card.suit === suit) {
                score += suitsConfig[suit].scoringRule(player.cards[suit], (_a = card.points) !== null && _a !== void 0 ? _a : 1);
            }
            else {
                score += suitsConfig[suit].scoringRule(player.cards[suit]);
            }
        }
    }
    if (IsActionCard(card)) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin = player.boardCoins[i];
        if (boardCoin !== undefined) {
            score += (_b = boardCoin === null || boardCoin === void 0 ? void 0 : boardCoin.value) !== null && _b !== void 0 ? _b : 0;
        }
        else {
            throw new Error(`В массиве монет игрока на столе отсутствует монета ${i}.`);
        }
        const handCoin = player.handCoins[i];
        if (handCoin !== undefined) {
            score += (_c = handCoin === null || handCoin === void 0 ? void 0 : handCoin.value) !== null && _c !== void 0 ? _c : 0;
        }
        else {
            throw new Error(`В массиве монет игрока в руке отсутствует монета ${i}.`);
        }
    }
    return score;
};
//# sourceMappingURL=BotCardLogic.js.map