import { isCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { isHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import { StartVidofnirVedrfolnirAction, UpgradeCoinAction } from "./AutoActions";
/**
 * <h3>Действия, связанные с добавлением монет в кошелёк для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 */
export const AddCoinToPouchAction = (G, ctx, coinId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], tempId = player.boardCoins.findIndex((coin, index) => index >= G.tavernsNum && !isCoin(coin));
    if (tempId !== -1) {
        player.boardCoins[tempId] = player.handCoins[coinId];
        player.handCoins[coinId] = null;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} положил монету ценностью '${player.boardCoins[tempId]}' в свой кошелёк.`);
        StartVidofnirVedrfolnirAction(G, ctx);
    }
    else {
        // TODO Error!
    }
};
/**
 * <h3>Действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для сбросом по действию карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G, ctx, suit, playerId, cardId) => {
    // TODO Rework it for players and fix it for bots?
    // TODO ctx.playerID === playerId???
    if (ctx.playerID !== undefined) {
        const player = G.publicPlayers[Number(playerId)], discardedCard = player.cards[suit].splice(cardId, 1)[0];
        if (!isHeroCard(discardedCard)) {
            G.discardCardsDeck.push(discardedCard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил карту ${discardedCard.name} в колоду сброса.`);
            player.stack = [];
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`);
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'ctx.playerID'.`);
    }
};
/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
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
    const playerConfig = (_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) === null || _a === void 0 ? void 0 : _a.config;
    if (playerConfig !== undefined) {
        if (playerConfig.value === 3) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinVidofnirVedrfolnir(2, coinId)]);
        }
        if (playerConfig.value !== undefined) {
            UpgradeCoinAction(G, ctx, playerConfig.value, coinId, type, isInitial);
        }
        else {
            // TODO Error logging!
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].config'.`);
    }
};
//# sourceMappingURL=CampActions.js.map