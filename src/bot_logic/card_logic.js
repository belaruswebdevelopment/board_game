import { isCardNotAction, CreateCard } from "../Card";
import { suitsConfig } from "../data/SuitData";
/**
 * <h3>Добавляет карту в массив потенциальных карт для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при подсчёте потенциального скоринга для ботов.</li>
 * </ol>
 *
 * @param cards Массив потенциальных карт для ботов.
 * @param card Карта.
 */
export const AddCardToCards = (cards, card) => {
    if (card.suit !== null) {
        cards[card.suit].push(card);
    }
    // todo Else it can be upgrade coin card here and it is not error, sure? Or add LogTypes.ERROR logging?
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns Профит карты.
 */
/*export const CardProfitForPlayer = (G: MyGameState, ctx: Ctx): number => {
    if (IsTopPlayer(G, Number(ctx.currentPlayer))) {
        let top2PlayerId: number = GetTop2PlayerId(G, Number(ctx.currentPlayer));
        if (top2PlayerId === -1) {
            return 0;
        }
        return 0;
    }
    let top1PlayerId: number = GetTop1PlayerId(G, Number(ctx.currentPlayer));
    if (top1PlayerId === -1) {
        return 0;
    }
    return 0;
};*/
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param card1 Первая карта.
 * @param card2 Вторая карта.
 * @returns Сравнительное значение.
 */
export const CompareCards = (card1, card2) => {
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (isCardNotAction(card1) && isCardNotAction(card2)) {
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
 * @todo Саше: сделать описание функции и параметров.
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
        const temp = tavern.map((card) => G.publicPlayers.map((player) => 
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        PotentialScoring({ player, card: card }))), result = temp[cardId][Number(ctx.currentPlayer)];
        temp.splice(cardId, 1);
        temp.forEach((player) => player.splice(Number(ctx.currentPlayer), 1));
        return result - Math.max(...temp.map((player) => Math.max(...player)));
    }
    if (compareCard !== null && `suit` in compareCard) {
        return CompareCards(compareCard, G.averageCards[compareCard.suit]);
    }
    // todo FIX IT, UNREACHABLE!? 0 === DEFAULT?!
    return 0;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param suitConfig Конфиг карт дворфов.
 * @param data ????????????????????????????????????????????????????????????????????
 * @returns "Средняя" карта дворфа.
 */
export const GetAverageSuitCard = (suitConfig, data) => {
    const avgCard = CreateCard({
        suit: suitConfig.suit,
        rank: 0,
        points: 0
    }), rank = suitConfig.ranksValues()[data.players][data.tier], points = suitConfig.pointsValues()[data.players][data.tier];
    const count = Array.isArray(points) ? points.length : points;
    if (avgCard.points !== null) {
        for (let i = 0; i < count; i++) {
            avgCard.rank += Array.isArray(rank) ? rank[i] : 1;
            avgCard.points += Array.isArray(points) ? points[i] : 1;
        }
        avgCard.rank /= count;
        avgCard.points /= count;
    }
    return avgCard;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param player Игрок.
 * @param card Карта.
 * @returns Потенциальное значение.
 */
export const PotentialScoring = ({ player = {}, card = {}, }) => {
    var _a, _b, _c, _d;
    const potentialCards = {};
    let score = 0;
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            potentialCards[suit] = [];
            for (let j = 0; j < player.cards[suit].length; j++) {
                AddCardToCards(potentialCards, player.cards[suit][j]);
            }
        }
    }
    if (card !== null && `suit` in card) {
        AddCardToCards(potentialCards, CreateCard(card));
    }
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            score += suitsConfig[suit].scoringRule(potentialCards[suit]);
        }
    }
    if (card !== null && `value` in card) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += (_b = (_a = player.boardCoins[i]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
        score += (_d = (_c = player.handCoins[i]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 0;
    }
    return score;
};
