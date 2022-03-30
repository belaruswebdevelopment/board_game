import { IsCoin, ReturnCoinToPlayerHands, UpgradeCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { CheckPlayerHasBuff, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypes, LogTypes, Stages, SuitNames } from "../typescript/enums";
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
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    AddActionsToStackAfterCurrent(G, ctx, [StackData.pickHero()]);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} должен выбрать нового героя.`);
};
/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DiscardTradingCoinAction = (G, ctx) => {
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
    let tradingCoinIndex = player.boardCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) === true);
    if (multiplayer && privatePlayer !== undefined) {
        if (tradingCoinIndex === -1) {
            tradingCoinIndex = privatePlayer.boardCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) === true);
        }
    }
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && tradingCoinIndex === -1) {
        tradingCoinIndex = handCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) === true);
        if (tradingCoinIndex === -1) {
            throw new Error(`В массиве монет игрока в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
        }
        handCoins.splice(tradingCoinIndex, 1, null);
    }
    else {
        if (tradingCoinIndex === -1) {
            throw new Error(`У игрока на столе не может отсутствовать обменная монета.`);
        }
        if (multiplayer && privatePlayer !== undefined) {
            privatePlayer.boardCoins.splice(tradingCoinIndex, 1, null);
        }
        player.boardCoins.splice(tradingCoinIndex, 1, null);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил монету активирующую обмен.`);
};
export const FinishOdroerirTheMythicCauldronAction = (G) => {
    G.odroerirTheMythicCauldron = false;
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
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        if (i > G.currentTavern) {
            ReturnCoinToPlayerHands(G, Number(ctx.currentPlayer), i);
        }
    }
};
/**
 * <h3>Старт действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartDiscardSuitCardAction = (G, ctx) => {
    var _a;
    const currentPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    if (currentPlayer === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack1 = currentPlayer.stack[1];
    if (stack1 === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 1 действие.`);
    }
    const value = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок.`);
        }
        if (i !== Number(ctx.currentPlayer) && player.cards[SuitNames.WARRIOR].length) {
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
};
/**
 * <h3>Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте способности карты лагеря артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartVidofnirVedrfolnirAction = (G, ctx) => {
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
    const number = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length, handCoinsNumber = handCoins.filter((coin) => IsCoin(coin)).length;
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && number > 0 && handCoinsNumber) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.addCoinToPouch(number)]);
    }
    else {
        let coinsValue = 0, stack = [];
        for (let j = G.tavernsNum; j < player.boardCoins.length; j++) {
            let coin;
            if (multiplayer && privatePlayer !== undefined) {
                coin = privatePlayer.boardCoins[j];
                if (coin === undefined) {
                    throw new Error(`В массиве приватных монет игрока на поле отсутствует монета ${j}.`);
                }
                if (IsCoin(coin)) {
                    player.boardCoins[j] = coin;
                }
            }
            else {
                coin = player.boardCoins[j];
                if (coin === undefined) {
                    throw new Error(`В массиве монет игрока на поле отсутствует монета ${j}.`);
                }
            }
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
    if (args.length === 1) {
        const multiplayer = IsMultiplayer(G), player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        let upgradingCoin;
        if (!CheckPlayerHasBuff(player, BuffNames.Coin)) {
            throw new Error(`У текущего игрока отсутствует обязательный баф ${BuffNames.Coin}.`);
        }
        DeleteBuffFromPlayer(G, ctx, BuffNames.Coin);
        let type;
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
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
            const allCoins = [], allHandCoins = handCoins.filter((coin) => IsCoin(coin));
            for (let i = 0; i < player.boardCoins.length; i++) {
                if (player.boardCoins[i] === null) {
                    const handCoin = allHandCoins.splice(0, 1)[0];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока в руке отсутствует монета ${i}.`);
                    }
                    allCoins.push(handCoin);
                }
                else {
                    const boardCoin = player.boardCoins[i];
                    if (boardCoin === undefined) {
                        throw new Error(`В массиве монет игрока на поле отсутствует монета ${i}.`);
                    }
                    if (IsCoin(boardCoin)) {
                        allCoins.push(boardCoin);
                    }
                }
            }
            const minCoinValue = Math.min(...allCoins.filter((coin) => IsCoin(coin) && !coin.isTriggerTrading).map((coin) => coin.value)), upgradingCoinsValue = allCoins.filter((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue).length;
            if (upgradingCoinsValue === 1) {
                const upgradingCoinId = allCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === upgradingCoin.value), boardCoin = player.boardCoins[upgradingCoinId];
                if (boardCoin === undefined) {
                    throw new Error(`В массиве монет игрока на столе нет монеты с индексом ${upgradingCoinId}.`);
                }
                if (boardCoin === null) {
                    const handCoinIndex = handCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue);
                    if (handCoinIndex === -1) {
                        throw new Error(`В массиве монет игрока в руке нет минимальной монеты с значением ${minCoinValue}.`);
                    }
                    const handCoin = handCoins[handCoinIndex];
                    if (handCoin === undefined) {
                        throw new Error(`В массиве монет игрока в руке нет монеты с индексом ${handCoinIndex}.`);
                    }
                    if (!IsCoin(handCoin)) {
                        throw new Error(`В массиве монет игрока в руке не может не быть монеты с индексом ${upgradingCoinId}.`);
                    }
                    upgradingCoin = handCoin;
                    type = CoinTypes.Hand;
                }
                else {
                    if (!IsCoin(boardCoin)) {
                        throw new Error(`В массиве монет игрока на столе не может быть закрытой монеты с индексом ${upgradingCoinId}.`);
                    }
                    upgradingCoin = boardCoin;
                    type = CoinTypes.Board;
                }
                UpgradeCoin(G, ctx, ...args, upgradingCoinId, type, upgradingCoin.isInitial);
            }
            else if (upgradingCoinsValue > 1) {
                AddActionsToStackAfterCurrent(G, ctx, [StackData.pickConcreteCoinToUpgrade(minCoinValue)]);
            }
            else if (upgradingCoinsValue <= 0) {
                throw new Error(`Количество монет для обмена не может быть меньше либо равно нулю.`);
            }
        }
        else {
            const minCoinValue = Math.min(...player.boardCoins.filter((coin) => IsCoin(coin) && !coin.isTriggerTrading)
                .map((coin) => coin.value)), upgradingCoinId = player.boardCoins.findIndex((coin) => (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue);
            type = CoinTypes.Board;
            if (upgradingCoinId === undefined) {
                throw new Error(`В массиве монет игрока на столе нет монеты с индексом ${upgradingCoinId}.`);
            }
            const boardCoin = player.boardCoins[upgradingCoinId];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока на столе нет монеты с индексом ${upgradingCoinId}.`);
            }
            if (boardCoin === null) {
                throw new Error(`В массиве монет игрока на столе не может не быть монеты с индексом ${upgradingCoinId}.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`В массиве монет игрока на столе не может быть закрытой монеты с индексом ${upgradingCoinId}.`);
            }
            upgradingCoin = boardCoin;
            UpgradeCoin(G, ctx, ...args, upgradingCoinId, type, upgradingCoin.isInitial);
        }
    }
    else {
        UpgradeCoin(G, ctx, ...args);
    }
};
//# sourceMappingURL=AutoActions.js.map