import { IsArtefactCard } from "../Camp";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddCampCardToCards } from "../helpers/CampCardHelpers";
import { DiscardPickedCard } from "../helpers/DiscardCardHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { ArtefactNames, CoinTypes, LogTypes, SuitNames } from "../typescript/enums";
import { StartVidofnirVedrfolnirAction } from "./CampAutoActions";
import { UpgradeCoinAction } from "./CoinActions";
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
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const tempId = player.boardCoins.findIndex((coin, index) => index >= G.tavernsNum && coin === null);
    if (tempId === -1) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoins;
    if (multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    const handCoin = handCoins[coinId];
    if (handCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует выбранная монета с id '${coinId}': это должно проверяться в MoveValidator.`);
    }
    if (handCoin === null) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может не быть монеты с id '${coinId}'.`);
    }
    if (!IsCoin(handCoin)) {
        throw new Error(`Монета с id '${coinId}' в руке текущего игрока с id '${ctx.currentPlayer}' не может быть закрытой для него.`);
    }
    if (!handCoin.isOpened) {
        ChangeIsOpenedCoinStatus(handCoin, true);
    }
    if (multiplayer) {
        player.handCoins[coinId] = null;
        privatePlayer.boardCoins[tempId] = handCoin;
    }
    player.boardCoins[tempId] = handCoin;
    handCoins[coinId] = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' положил монету ценностью '${handCoin.value}' в свой кошель.`);
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
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G, ctx, cardId) => {
    const player = G.publicPlayers[Number(ctx.playerID)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${ctx.playerID}'.`);
    }
    const discardedCard = player.cards[SuitNames.WARRIOR].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${ctx.currentPlayer}' отсутствует выбранная карта с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    DiscardPickedCard(G, player, discardedCard);
    player.stack = [];
};
export const PickCampCardAction = (G, ctx, cardId) => {
    const campCard = G.camp[cardId];
    if (campCard === undefined) {
        throw new Error(`Отсутствует кликнутая карта лагеря с id '${cardId}': это должно проверяться в MoveValidator.`);
    }
    if (campCard === null) {
        throw new Error(`Не существует кликнутая карта лагеря с id '${cardId}'.`);
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
            throw new Error(`Не существует минимальная монета на рынке с значением - '${minCoinValue}'.`);
        }
        const coin = G.marketCoins.splice(minCoinIndex, 1)[0];
        if (coin === undefined) {
            throw new Error(`Отсутствует минимальная монета на рынке с id '${minCoinIndex}'.`);
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
 */
export const UpgradeCoinVidofnirVedrfolnirAction = (G, ctx, coinId, type) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const value = (_a = stack.config) === null || _a === void 0 ? void 0 : _a.value;
    if (value === undefined) {
        throw new Error(`У конфига действия игрока с id '${ctx.currentPlayer}' отсутствует обязательный параметр значения улучшаемой монеты '${ArtefactNames.Vidofnir_Vedrfolnir}'.`);
    }
    if (value === 3) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinVidofnirVedrfolnir(2, coinId)]);
    }
    UpgradeCoinAction(G, ctx, false, value, coinId, type);
};
//# sourceMappingURL=CampActions.js.map