import { IsArtefactCard, IsMercenaryPlayerCard } from "../Camp";
import { StackData } from "../data/StackData";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddCampCardToCards } from "../helpers/CampCardHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { LogTypes, RusCardTypes } from "../typescript/enums";
import { StartVidofnirVedrfolnirAction, UpgradeCoinAction } from "./AutoActions";
/**
 * <h3>Действия, связанные с добавлением монет в кошель для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 */
export const AddCoinToPouchAction = (G, ctx, coinId) => {
    const multiplayer = IsMultiplayer(G), player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    let handCoins;
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    const tempId = player.boardCoins.findIndex((coin, index) => index >= G.tavernsNum && coin === null);
    if (tempId === -1) {
        throw new Error(`В массиве монет игрока на столе отсутствует монета для добавления в кошель для обмена для действия артефакта 'VidofnirVedrfolnir'.`);
    }
    const coin = handCoins[coinId];
    if (coin === undefined) {
        throw new Error(`В массиве монет игрока в руке отсутствует выбранная монета: это должно проверяться в MoveValidator.`);
    }
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.boardCoins[tempId] = coin;
    }
    player.boardCoins[tempId] = coin;
    handCoins[coinId] = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} положил монету ценностью '${player.boardCoins[tempId]}' в свой кошель.`);
    StartVidofnirVedrfolnirAction(G, ctx);
};
/**
 * <h3>Действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для сбросом по действию карты лагеря артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G, ctx, suit, cardId) => {
    if (ctx.playerID === undefined) {
        throw new Error(`Отсутствует обязательный параметр 'ctx.playerID'.`);
    }
    const player = G.publicPlayers[Number(ctx.playerID)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${ctx.playerID}.`);
    }
    const discardedCard = player.cards[suit].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    }
    if (IsHeroCard(discardedCard)) {
        throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    }
    if (IsMercenaryPlayerCard(discardedCard) || IsArtefactCard(discardedCard)) {
        G.discardCampCardsDeck.push(discardedCard);
    }
    else {
        G.discardCardsDeck.push(discardedCard);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил карту '${discardedCard.name}' в колоду сброса.`);
    player.stack = [];
};
export const PickCampCardAction = (G, ctx, cardId) => {
    const campCard = G.camp[cardId];
    if (campCard === undefined) {
        throw new Error(`Отсутствует кликнутая карта лагеря.`);
    }
    if (campCard === null) {
        throw new Error(`Не существует кликнутая карта лагеря.`);
    }
    G.camp.splice(cardId, 1, null);
    AddCampCardToCards(G, ctx, campCard);
    if (IsArtefactCard(campCard)) {
        AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
        StartAutoAction(G, ctx, campCard.actions);
    }
    if (G.odroerirTheMythicCauldron) {
        const minCoinValue = G.marketCoins.reduceRight((prev, curr) => prev.value < curr.value ? prev : curr).value;
        const minCoinIndex = G.marketCoins.findIndex((coin) => coin.value === minCoinValue);
        if (minCoinIndex === -1) {
            throw new Error(`Не существует минимальная монета на рынке с значением - ${minCoinValue}.`);
        }
        const coin = G.marketCoins.splice(minCoinIndex, 1)[0];
        if (coin === undefined) {
            throw new Error(`Отсутствует минимальная монета на рынке с индексом - ${minCoinIndex}.`);
        }
        G.odroerirTheMythicCauldronCoins.push(coin);
    }
};
/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты лагеря артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли монета базовой.
 */
export const UpgradeCoinVidofnirVedrfolnirAction = (G, ctx, coinId, type, isInitial) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const value = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.value;
    if (value === undefined) {
        throw new Error(`У конфига действия игрока отсутствует обязательный параметр значения улучшаемой монеты 'VidofnirVedrfolnir'.`);
    }
    if (value === 3) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinVidofnirVedrfolnir(2, coinId)]);
    }
    UpgradeCoinAction(G, ctx, value, coinId, type, isInitial);
};
//# sourceMappingURL=CampActions.js.map