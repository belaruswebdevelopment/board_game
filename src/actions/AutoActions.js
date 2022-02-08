import { ReturnCoinToPlayerHands, UpgradeCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { HeroNames, LogTypes, Stages } from "../typescript/enums";
/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddPickHeroAction = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.pickHero()]);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен выбрать нового героя.`);
};
/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DiscardTradingCoinAction = (G, ctx) => {
    let tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex((coin) => Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading));
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
        && tradingCoinIndex === -1) {
        tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin) => Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading));
        G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .splice(tradingCoinIndex, 1, null);
    }
    else {
        G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .splice(tradingCoinIndex, 1, null);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} сбросил монету активирующую обмен.`);
};
/**
 * <h3>Действия, связанные с возвращением закрытых монет со стола в руку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const GetClosedCoinIntoPlayerHandAction = (G, ctx) => {
    for (let i = 0; i < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; i++) {
        if (i > G.currentTavern) {
            ReturnCoinToPlayerHands(G.publicPlayers[Number(ctx.currentPlayer)], i);
        }
    }
};
/**
 * <h3>Старт действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartDiscardSuitCardAction = (G, ctx) => {
    var _a;
    const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[1].config;
    if (config !== undefined && config.suit !== undefined) {
        const value = {};
        for (let i = 0; i < ctx.numPlayers; i++) {
            if (i !== Number(ctx.currentPlayer) && G.publicPlayers[i].cards[config.suit].length) {
                value[i] = {
                    stage: Stages.DiscardSuitCard,
                };
                AddActionsToStackAfterCurrent(G, ctx, [StackData.discardSuitCard(i)]);
            }
        }
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setActivePlayers({
            value,
            minMoves: 1,
            maxMoves: 1,
        });
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.suit'.`);
    }
};
/**
 * <h3>Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте способности карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartVidofnirVedrfolnirAction = (G, ctx) => {
    var _a;
    const number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .filter((coin, index) => index >= G.tavernsNum && coin === null).length, handCoinsNumber = G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length;
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline && number > 0
        && handCoinsNumber) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.addCoinToPouch(number)]);
    }
    else {
        let coinsValue = 0, stack = [];
        for (let j = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            if (!((_a = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
                coinsValue++;
            }
        }
        if (coinsValue === 1) {
            stack = [StackData.upgradeCoinVidofnirVedrfolnir(5)];
        }
        else if (coinsValue === 2) {
            stack = [StackData.upgradeCoinVidofnirVedrfolnir(3)];
        }
        else {
            // TODO log error!?
        }
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
};
/**
 * <h3>Действия, связанные с улучшением монет от карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinAction = (G, ctx, ...args) => {
    UpgradeCoin(G, ctx, ...args);
};
//# sourceMappingURL=AutoActions.js.map