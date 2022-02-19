import { CreateCard, isCardNotActionAndNotNull } from "../Card";
import { suitsConfig } from "../data/SuitData";
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
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (isCardNotActionAndNotNull(card1) && isCardNotActionAndNotNull(card2)) {
        if (card1.suit === card2.suit) {
            const result = (card1.points !== undefined && card1.points !== null ?
                card1.points : 1) - (card2.points !== undefined && card2.points !== null ? card2.points : 1);
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
    if (compareCard !== null && `suit` in compareCard) {
        if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareCards(compareCard, G.averageCards[compareCard.suit]);
        }
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        const temp = tavern.map((card) => G.publicPlayers.map((player) => PotentialScoring(player, card))), result = temp[cardId][Number(ctx.currentPlayer)];
        temp.splice(cardId, 1);
        temp.forEach((player) => player.splice(Number(ctx.currentPlayer), 1));
        return result - Math.max(...temp.map((player) => Math.max(...player)));
    }
    if (compareCard !== null && `suit` in compareCard) {
        return CompareCards(compareCard, G.averageCards[compareCard.suit]);
    }
    // TODO FIX IT, UNREACHABLE!? 0 === DEFAULT?!
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
    let totalRank = 0, totalPoints = 0;
    const rank = suitConfig.ranksValues()[data.players][data.tier], points = suitConfig.pointsValues()[data.players][data.tier], count = Array.isArray(points) ? points.length : points;
    for (let i = 0; i < count; i++) {
        totalRank += Array.isArray(rank) ? rank[i] : 1;
        totalPoints += Array.isArray(points) ? points[i] : 1;
    }
    totalRank /= count;
    totalPoints /= count;
    const avgCard = CreateCard({
        suit: suitConfig.suit,
        rank: totalRank,
        points: totalPoints,
    });
    return avgCard;
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
    var _a, _b, _c, _d, _e;
    let score = 0, suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (isCardNotActionAndNotNull(card) && card.suit === suit) {
                score += suitsConfig[suit].scoringRule(player.cards[suit], (_a = card.points) !== null && _a !== void 0 ? _a : 1);
            }
            else {
                score += suitsConfig[suit].scoringRule(player.cards[suit]);
            }
        }
    }
    if (card !== null && `value` in card) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += (_c = (_b = player.boardCoins[i]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 0;
        score += (_e = (_d = player.handCoins[i]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : 0;
    }
    return score;
};
//# sourceMappingURL=BotCardLogic.js.map