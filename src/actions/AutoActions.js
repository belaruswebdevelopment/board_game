import { IsCoin, ReturnCoinToPlayerHands, UpgradeCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { BuffNames, LogTypes, Stages } from "../typescript/enums";
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
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    let tradingCoinIndex = player.boardCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) === true);
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && tradingCoinIndex === -1) {
        tradingCoinIndex =
            player.handCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) === true);
        if (tradingCoinIndex !== -1) {
            player.handCoins.splice(tradingCoinIndex, 1, null);
        }
        else {
            throw new Error(`У игрока в 'handCoins' отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
        }
    }
    else if (tradingCoinIndex !== -1) {
        player.boardCoins.splice(tradingCoinIndex, 1, null);
    }
    else {
        throw new Error(`У игрока не может отсутствовать обменная монета.`);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил монету активирующую обмен.`);
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
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    for (let i = 0; i < player.boardCoins.length; i++) {
        if (i > G.currentTavern) {
            ReturnCoinToPlayerHands(player, i);
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
        throw new Error(`У игрока отсутствует обязательный параметр 'stack[1].config' и/или 'stack[1].config.suit'.`);
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
    const player = G.publicPlayers[Number(ctx.currentPlayer)], number = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length, handCoinsNumber = player.handCoins.length;
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && number > 0 && handCoinsNumber) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.addCoinToPouch(number)]);
    }
    else {
        let coinsValue = 0, stack = [];
        for (let j = G.tavernsNum; j < player.boardCoins.length; j++) {
            const coin = player.boardCoins[j];
            if (IsCoin(coin) && !coin.isTriggerTrading) {
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
            throw new Error(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта 'VidofnirVedrfolnir', а не ${coinsValue} монет(ы).`);
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