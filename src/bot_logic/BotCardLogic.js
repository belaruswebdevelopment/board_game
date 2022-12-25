import { suitsConfig } from "../data/SuitData";
import { StartSuitScoring } from "../dispatchers/SuitScoringDispatcher";
import { CreateDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { ErrorNames, GameModeNames, RusCardTypeNames, SuitNames } from "../typescript/enums";
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
export const CompareTavernCards = (card1, card2) => {
    var _a, _b;
    if (card1 === null || card2 === null) {
        return 0;
    }
    // TODO If Mythological Creatures cards!?
    if (card1.type === RusCardTypeNames.Dwarf_Card && card2.type === RusCardTypeNames.Dwarf_Card) {
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
 * @param context
 * @param compareCard Карта для сравнения.
 * @param cardId Id карты.
 * @param tavern Таверна.
 * @returns Сравнительное значение.
 */
export const EvaluateTavernCard = ({ G, ctx, ...rest }, compareCard, cardId, tavern) => {
    if (compareCard !== null && compareCard.type === RusCardTypeNames.Dwarf_Card) {
        if (G.secret.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareTavernCards(compareCard, G.averageCards[compareCard.suit]);
        }
    }
    // TODO If Mythological Creatures cards!?
    if (G.secret.decks[1].length < G.botData.deckLength) {
        const temp = tavern.map((card) => Object.values(G.publicPlayers).map((player, index) => PotentialTavernCardScoring({ G, ctx, myPlayerID: String(index), ...rest }, card))), tavernCardResults = temp[cardId];
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
    if (compareCard !== null && compareCard.type === RusCardTypeNames.Dwarf_Card) {
        return CompareTavernCards(compareCard, G.averageCards[compareCard.suit]);
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
    // TODO Rework it to non-dwarf card?
    return CreateDwarfCard({
        suit: suitConfig.suit,
        points: totalPoints,
        name: `Average card`,
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
 * @param context
 * @param card Карта.
 * @returns Потенциальное значение.
 */
const PotentialTavernCardScoring = ({ G, ctx, myPlayerID, ...rest }, card) => {
    var _a;
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let handCoins;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    let score = 0, suit;
    for (suit in suitsConfig) {
        if (card !== null && card.type === RusCardTypeNames.Dwarf_Card && card.suit === suit) {
            score +=
                StartSuitScoring(suitsConfig[suit].scoringRule, [player.cards[suit], (_a = card.points) !== null && _a !== void 0 ? _a : 1]);
        }
        else {
            score += StartSuitScoring(suitsConfig[suit].scoringRule, [player.cards[suit]]);
        }
    }
    if (card !== null && card.type === RusCardTypeNames.Royal_Offering_Card) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе отсутствует монета с id '${i}'.`);
        }
        // TODO Check it it can be error in !multiplayer, but bot can't play in multiplayer now...
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(boardCoin)) {
            score += boardCoin.value;
        }
        const handCoin = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(handCoin)) {
            score += handCoin.value;
        }
    }
    return score;
};
//# sourceMappingURL=BotCardLogic.js.map