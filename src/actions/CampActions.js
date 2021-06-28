import {AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {AddCampCardToPlayer, AddCampCardToPlayerCards} from "../Player";
import {CheckAndMoveThrudOrPickHeroAction} from "./HeroActions";

/**
 * Действия, связанные с возможностью взятия карт из кэмпа.
 * Применения:
 * 1) При выборе конкретных героев, дающих возможность взять карты из кэмпа.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
export const CheckPickCampCard = (G, ctx) => {
    if (G.camp.length === 0) {
        G.stack[ctx.currentPlayer].splice(1);
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с добавлением карт кэмпа в массив карт игрока.
 * Применения:
 * 1) При выборе карт кэмпа, добавляющихся на планшет игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
export const AddCampCardToCards = (G, ctx, config, cardId) => {
    const campCard = G.camp[cardId];
    let suitId = null,
        stack = [];
    G.camp[cardId] = null;
    G.campPicked = true;
    if (campCard.suit) {
        AddCampCardToPlayerCards(G, ctx, campCard);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, campCard);
        suitId = GetSuitIndexByName(campCard.suit);
    } else {
        AddCampCardToPlayer(G, ctx, campCard);
        if (ctx.phase === "enlistmentMercenaries" && G.players[ctx.currentPlayer].campCards.filter(card => card.type === "наёмник").length) {
            stack = [
                {
                    stack: {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "enlistmentMercenaries",
                        },
                    },
                },
            ];
        }
    }
    return EndActionFromStackAndAddNew(G, ctx, stack, suitId);
};

/**
 * Действия, связанные с добавлением монет в кошелёк для обмена при наличии пермонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.
 * Применения:
 * 1) При выборе карты кэмпа Vidofnir Vedrfolnir и наличии героя Улина.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param coinId Id монеты.
 * @constructor
 */
export const AddCoinToPouchAction = (G, ctx, config, coinId) => {
    ctx.events.setStage(G.stack[ctx.currentPlayer][0].stack.config.stageName);
    const player = G.players[ctx.currentPlayer];
    const tempId = player.boardCoins.findIndex((coin, index) => index >= G.tavernsNum && coin === null);
    player.boardCoins[tempId] = player.handCoins[coinId];
    player.handCoins[coinId] = null;
    if (G.actionsNum === 0) {
        const stack = [
            {
                stack: {
                    actionName: "StartVidofnirVedrfolnirAction",
                    config: {
                        card: "Vidofnir Vedrfolnir",
                    },
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
        return EndActionFromStackAndAddNew(G, ctx);
    }
};

/**
 * Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.
 * Применения:
 * 1) При старте способности карты кэмпа артефакта Vidofnir Vedrfolnir.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
export const StartVidofnirVedrfolnirAction = (G, ctx) => {
    const number = G.players[ctx.currentPlayer].boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
    if (G.players[ctx.currentPlayer].buffs?.["everyTurn"] === "Uline" && number > 0) {
        const stack = [
            {
                stack: {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "AddCoinToPouchVidofnirVedrfolnir",
                        stageName: "addCoinToPouch",
                        number: number,
                    },
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    } else {
        let coinsValue = 0,
            stack = [];
        for (let j = G.tavernsNum; j < G.players[ctx.currentPlayer].boardCoins.length; j++) {
            if (G.players[ctx.currentPlayer].boardCoins[j] &&
                !G.players[ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
                coinsValue++;
            }
        }
        if (coinsValue === 1) {
            stack = [
                {
                    stack: {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "VidofnirVedrfolnirAction",
                            stageName: "upgradeCoinVidofnirVedrfolnir",
                            number: 1,
                            value: 5,
                        },
                    },
                },
                {
                    stack: {
                        actionName: "UpgradeCoinAction",
                        config: {
                            number: 1,
                            value: 5,
                        },
                    },
                },
            ];
        } else if (coinsValue === 2) {
            stack = [
                {
                    stack: {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "VidofnirVedrfolnirAction",
                            stageName: "upgradeCoinVidofnirVedrfolnir",
                            number: 2,
                            value: 3,
                        },
                    },
                },
            ];
        }
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные со сбросом обменной монеты.
 * Применения:
 * 1) При выборе карты кэмпа артефакта Jarnglofi.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
export const DiscardTradingCoin = (G, ctx) => {
    ctx.events.setStage(G.stack[ctx.currentPlayer][0].stack.config.stageName);
    let tradingCoinIndex = G.players[ctx.currentPlayer].boardCoins.findIndex(coin => coin?.value === 0);
    if (G.players[ctx.currentPlayer].buffs?.["everyTurn"] === "Uline" && tradingCoinIndex === -1) {
        tradingCoinIndex = G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin?.value === 0);
        G.players[ctx.currentPlayer].handCoins.splice(tradingCoinIndex, 1, null);
    } else {
        G.players[ctx.currentPlayer].boardCoins.splice(tradingCoinIndex, 1, null);
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с дискардом карты из конфретной фракции игрока.
 * Применения:
 * 1) При выборе карты кэмпа артефакта Hofud.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {*}
 * @constructor
 */
export const DiscardSuitCard = (G, ctx, config) => {
    ctx.events.setStage(G.stack[ctx.currentPlayer][0].stack.config.stageName);
    const suitId = GetSuitIndexByName(config.suit),
        value = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (i !== Number(ctx.currentPlayer) && G.players[i].cards[suitId].length) {
            value[i] = "discardSuitCard";
        }
    }
    ctx.events.setActivePlayers({
        value,
        moveLimit: 1,
    });
    G.drawProfit = config.name;
    // todo CHECK return EndActionFromStackAndAddNew(G, ctx);
};
