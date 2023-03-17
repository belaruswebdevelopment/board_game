import { suitsConfig } from "../data/SuitData";
import { StartSuitScoring } from "../dispatchers/SuitScoringDispatcher";
import { CreateDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { AssertPlayerCoinId } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { CardTypeRusNames, ErrorNames, GameModeNames } from "../typescript/enums";
// Check all number types here!
// Check all types in this file!
/**
 * <h3>Сравнивает значения очков основной карт из таверны с остальными картами.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При вычислении сравнения значений карт для ботов.</li>
 * </oL>
 *
 * @param compareCard Основная сравниваемая карта.
 * @param card2 Остальная карта в таверне для сравнения.
 * @returns Сравнительное значение.
 */
export const CompareTavernCards = (compareCard, card2) => {
    var _a, _b;
    if (compareCard === null || card2 === null) {
        return 0;
    }
    // TODO If Mythological Creatures cards!?
    if (compareCard.type === CardTypeRusNames.DwarfCard && card2.type === CardTypeRusNames.DwarfCard) {
        if (compareCard.playerSuit === card2.playerSuit) {
            const result = ((_a = compareCard.points) !== null && _a !== void 0 ? _a : 1) - ((_b = card2.points) !== null && _b !== void 0 ? _b : 1);
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
    if (compareCard !== null && compareCard.type === CardTypeRusNames.DwarfCard) {
        if (G.secret.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareTavernCards(compareCard, G.averageCards[compareCard.playerSuit]);
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
        const amount = 1, removedFromTemp = temp.splice(cardId, amount);
        if (amount !== removedFromTemp.length) {
            throw new Error(`Недостаточно карт в массиве temp: требуется - '${amount}', в наличии - '${removedFromTemp.length}'.`);
        }
        temp.forEach((player) => {
            const removedFromPlayer = player.splice(Number(ctx.currentPlayer), amount);
            if (amount !== removedFromPlayer.length) {
                throw new Error(`Недостаточно карт в массиве player: требуется - '${amount}', в наличии - '${removedFromPlayer.length}'.`);
            }
            return removedFromPlayer;
        });
        if (amount !== removedFromTemp.length) {
            throw new Error(`Недостаточно карт в массиве temp: требуется - '${amount}', в наличии - '${removedFromTemp.length}'.`);
        }
        return result - Math.max(...temp.map((player) => Math.max(...player)));
    }
    if (compareCard !== null && compareCard.type === CardTypeRusNames.DwarfCard) {
        return CompareTavernCards(compareCard, G.averageCards[compareCard.playerSuit]);
    }
    return 0;
};
/**
 * <h3>Определяет "среднюю карту" в конкретной фракции, определяющую сколько в среднем очков она приносит.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При инициализации игры для каждой фракции.</li>
 * </oL>
 *
 * @param suit Фракция дворфов.
 * @param data Данные о количестве игроков и эпохах.
 * @returns "Средняя" карта дворфа.
 */
export const GetAverageSuitCard = (suit, data) => {
    let totalPoints = 0;
    const pointsValuesPlayers = suitsConfig[suit].pointsValues()[data.players], points = pointsValuesPlayers[data.tier], count = Array.isArray(points) ? points.length : points;
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
        name: `Average card`,
        playerSuit: suitsConfig[suit].suit,
        // TODO Can i add type!?
        points: totalPoints,
    });
};
/**
 * <h3>Определяет сколько очков принесёт выбор конкретной карты из таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора ботом карты из таверны.</li>
 * </oL>
 *
 * @param context
 * @param card Карта.
 * @returns Потенциальное значение очков после выбора конкретной карты.
 */
const PotentialTavernCardScoring = ({ G, ctx, myPlayerID, ...rest }, card) => {
    var _a;
    // TODO How it play with Idavoll!?
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
        if (card !== null && card.type === CardTypeRusNames.DwarfCard && card.playerSuit === suit) {
            score +=
                StartSuitScoring(suitsConfig[suit].scoringRule, [player.cards[suit], (_a = card.points) !== null && _a !== void 0 ? _a : 1]);
        }
        else {
            score += StartSuitScoring(suitsConfig[suit].scoringRule, [player.cards[suit]]);
        }
    }
    if (card !== null && card.type === CardTypeRusNames.RoyalOfferingCard) {
        score += card.upgradeValue;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        AssertPlayerCoinId(i);
        const boardCoin = player.boardCoins[i];
        // TODO Check it it can be error in !multiplayer, but bot can't play in multiplayer now...
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(boardCoin)) {
            score += boardCoin.value;
        }
        const handCoin = handCoins[i];
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