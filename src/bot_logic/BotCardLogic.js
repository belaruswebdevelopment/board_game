import { IsCoin } from "../Coin";
import { suitsConfig } from "../data/SuitData";
import { CreateDwarfCard, IsDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { IsRoyalOfferingCard } from "../RoyalOffering";
import { ErrorNames, GameNames } from "../typescript/enums";
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
    if (IsDwarfCard(card1) && IsDwarfCard(card2)) {
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
    if (IsDwarfCard(compareCard)) {
        const deckTier1 = G.secret.decks[0];
        if (deckTier1 === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 0);
        }
        if (deckTier1.length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareCards(compareCard, G.averageCards[compareCard.suit]);
        }
    }
    const deckTier2 = G.secret.decks[1];
    if (deckTier2 === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
    }
    if (deckTier2.length < G.botData.deckLength) {
        const temp = tavern.map((card) => Object.values(G.publicPlayers).map((player, index) => PotentialScoring(G, index, card))), tavernCardResults = temp[cardId];
        if (tavernCardResults === undefined) {
            throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат выбранной карты таверны для текущего игрока.`);
        }
        const result = tavernCardResults[Number(ctx.currentPlayer)];
        if (result === undefined) {
            throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат для текущего игрока с id '${ctx.currentPlayer}'.`);
        }
        temp.splice(cardId, 1);
        temp.forEach((player) => player.splice(Number(ctx.currentPlayer), 1));
        return result - Math.max(...temp.map((player) => Math.max(...player)));
    }
    if (IsDwarfCard(compareCard)) {
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
    if (pointsValuesPlayers === undefined) {
        throw new Error(`Отсутствует массив значений карт для указанного числа игроков - '${data.players}'.`);
    }
    const points = pointsValuesPlayers[data.tier];
    if (points === undefined) {
        throw new Error(`Отсутствует массив значений карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
    }
    const count = Array.isArray(points) ? points.length : points;
    for (let i = 0; i < count; i++) {
        if (Array.isArray(points)) {
            const pointsValue = points[i];
            if (pointsValue === undefined) {
                throw new Error(`Отсутствует значение с id '${i}' в массиве карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
            }
            totalPoints += pointsValue;
        }
        else {
            totalPoints += 1;
        }
    }
    totalPoints /= count;
    return CreateDwarfCard({
        suit: suitConfig.suit,
        points: totalPoints,
        name: `Average card`,
        game: GameNames.Basic,
    });
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
 * @param player Игрок.
 * @param card Карта.
 * @returns Потенциальное значение.
 */
const PotentialScoring = (G, playerId, card) => {
    var _a;
    const player = G.publicPlayers[playerId], privatePlayer = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок  с id '${playerId}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует игрок с id '${playerId}'.`);
    }
    let handCoins;
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    let score = 0, suit;
    for (suit in suitsConfig) {
        if (IsDwarfCard(card) && card.suit === suit) {
            score +=
                suitsConfig[suit].scoringRule(player.cards[suit], suit, (_a = card.points) !== null && _a !== void 0 ? _a : 1);
        }
        else {
            score += suitsConfig[suit].scoringRule(player.cards[suit], suit);
        }
    }
    if (IsRoyalOfferingCard(card)) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerId}' на столе отсутствует монета с id '${i}'.`);
        }
        // TODO Check it it can be error in !multiplayer, but bot can't play in multiplayer now...
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerId}' на столе не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(boardCoin)) {
            score += boardCoin.value;
        }
        const handCoin = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerId}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerId}' в руке не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(handCoin)) {
            score += handCoin.value;
        }
    }
    return score;
};
//# sourceMappingURL=BotCardLogic.js.map