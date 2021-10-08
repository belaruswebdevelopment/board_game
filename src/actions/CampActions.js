import {
    AddActionsToStack,
    AddActionsToStackAfterCurrent,
    EndActionForChosenPlayer,
    EndActionFromStackAndAddNew
} from "../helpers/StackHelpers";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {AddCampCardToPlayer, AddCampCardToPlayerCards} from "../Player";
import {CheckAndMoveThrudOrPickHeroAction} from "./HeroActions";
import {AddDataToLog} from "../Logging";
import {suitsConfig} from "../data/SuitData";
import {AfterBasicPickCardActions} from "../helpers/MovesHelpers";

/**
 * <h3>Действия, связанные с возможностью взятия карт из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из кэмпа.</li>
 * </ol>
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
 * <h3>Действия, связанные с добавлением карт кэмпа в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, добавляющихся на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
export const AddCampCardToCards = (G, ctx, config, cardId) => {
    if (ctx.phase === "pickCards" && Number(ctx.currentPlayer) === G.playersOrder[0] && ctx.activePlayers === null) {
        G.campPicked = true;
    }
    if (G.players[ctx.currentPlayer].buffs["goCampOneTime"]) {
        delete G.players[ctx.currentPlayer].buffs["goCampOneTime"];
    }
    const campCard = G.camp[cardId];
    let suitId = null,
        stack = [];
    G.camp[cardId] = null;
    if (campCard.suit) {
        AddCampCardToPlayerCards(G, ctx, campCard);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, campCard);
        suitId = GetSuitIndexByName(campCard.suit);
    } else {
        AddCampCardToPlayer(G, ctx, campCard);
        if (ctx.phase === "enlistmentMercenaries" && G.players[ctx.currentPlayer].campCards.filter(card => card.type === "наёмник").length) {
            stack = [
                {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "enlistmentMercenaries",
                        drawName: "Enlistment Mercenaries",
                    },
                },
            ];
        }
    }
    return EndActionFromStackAndAddNew(G, ctx, stack, suitId);
};

/**
 * <h3>Действия, связанные с добавлением монет в кошелёк для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param coinId Id монеты.
 * @constructor
 */
export const AddCoinToPouchAction = (G, ctx, config, coinId) => {
    const player = G.players[ctx.currentPlayer],
        tempId = player.boardCoins.findIndex((coin, index) => index >= G.tavernsNum && coin === null),
        stack = [
            {
                actionName: "StartVidofnirVedrfolnirAction",
            },
        ];
    player.boardCoins[tempId] = player.handCoins[coinId];
    player.handCoins[coinId] = null;
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} положил монету ценностью 
    '${player.boardCoins[tempId]}' в свой кошелёк.`);
    AddActionsToStackAfterCurrent(G, ctx, stack);
    return EndActionFromStackAndAddNew(G, ctx);
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
 * @returns {*}
 * @constructor
 */
export const StartVidofnirVedrfolnirAction = (G, ctx) => {
    const number = G.players[ctx.currentPlayer].boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length,
        handCoinsNumber = G.players[ctx.currentPlayer].handCoins.length;
    if (G.players[ctx.currentPlayer].buffs["everyTurn"] === "Uline" && number > 0 && handCoinsNumber) {
        const stack = [
            {
                actionName: "DrawProfitAction",
                config: {
                    name: "AddCoinToPouchVidofnirVedrfolnir",
                    stageName: "addCoinToPouch",
                    number: number,
                    drawName: "Add coin to pouch Vidofnir Vedrfolnir",
                },
            },
            {
                actionName: "AddCoinToPouchAction",
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
                    actionName: "DrawProfitAction",
                    config: {
                        name: "VidofnirVedrfolnirAction",
                        stageName: "upgradeCoinVidofnirVedrfolnir",
                        value: 5,
                        drawName: "Upgrade coin Vidofnir Vedrfolnir",
                    },
                },
                {
                    actionName: "UpgradeCoinVidofnirVedrfolnirAction",
                    config: {
                        value: 5,
                    }
                },
            ];
        } else if (coinsValue === 2) {
            stack = [
                {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "VidofnirVedrfolnirAction",
                        stageName: "upgradeCoinVidofnirVedrfolnir",
                        number: 2,
                        value: 3,
                        drawName: "Upgrade coin Vidofnir Vedrfolnir",
                    },
                },
                {
                    actionName: "UpgradeCoinVidofnirVedrfolnirAction",
                    config: {
                        value: 3,
                    }
                },
            ];
        }
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    return EndActionFromStackAndAddNew(G, ctx);
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
 * @param config Конфиг действий артефакта.
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли монета базовой.
 * @returns {*}
 * @constructor
 */
export const UpgradeCoinVidofnirVedrfolnirAction = (G, ctx, config, coinId, type, isInitial) => {
    let stack;
    if (G.stack[ctx.currentPlayer][0].config.value === 3) {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    value: 3,
                },
            },
            {
                actionName: "DrawProfitAction",
                config: {
                    coinId,
                    name: "VidofnirVedrfolnirAction",
                    stageName: "upgradeCoinVidofnirVedrfolnir",
                    value: 2,
                    drawName: "Upgrade coin Vidofnir Vedrfolnir",
                },
            },
            {
                actionName: "UpgradeCoinVidofnirVedrfolnirAction",
                config: {
                    value: 2,
                }
            },
        ];
    } else if (G.stack[ctx.currentPlayer][0].config.value === 2) {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    value: 2,
                },
            },
        ];
    } else if (G.stack[ctx.currentPlayer][0].config.value === 5) {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    value: 5,
                },
            },
        ];
    }
    AddActionsToStackAfterCurrent(G, ctx, stack);
    return EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
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
 * @returns {*}
 * @constructor
 */
export const DiscardTradingCoin = (G, ctx) => {
    let tradingCoinIndex = G.players[ctx.currentPlayer].boardCoins.findIndex(coin => coin && coin.isTriggerTrading);
    if (G.players[ctx.currentPlayer].buffs["everyTurn"] === "Uline" && tradingCoinIndex === -1) {
        tradingCoinIndex = G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin && coin.isTriggerTrading);
        G.players[ctx.currentPlayer].handCoins.splice(tradingCoinIndex, 1, null);
    } else {
        G.players[ctx.currentPlayer].boardCoins.splice(tradingCoinIndex, 1, null);
    }
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} сбросил монету активирующую обмен.`);
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные со сбросом любой указанной карты со стола игрока в дискард.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param suitId Id фракции.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
export const DiscardAnyCardFromPlayerBoard = (G, ctx, config, suitId, cardId) => {
    const discardedCard = G.players[ctx.currentPlayer].cards[suitId].splice(cardId, 1)[0];
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} сбросил карту ${discardedCard.name} 
    в дискард.`);
    delete G.players[ctx.currentPlayer].buffs["discardCardEndGame"];
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Старт действия, связанные с дискардом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config
 * @constructor
 */
export const StartDiscardSuitCard = (G, ctx, config) => {
    const suitId = GetSuitIndexByName(config.suit),
        value = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (i !== Number(ctx.currentPlayer) && G.players[i].cards[suitId].length) {
            value[i] = {
                stage: "discardSuitCard",
            };
            const stack = [
                {
                    actionName: "DiscardSuitCard",
                    playerId: i,
                    config: {
                        suit: "warrior",
                    },
                },
            ];
            AddActionsToStack(G, ctx, stack);
        }
    }
    ctx.events.setActivePlayers({
        value,
    });
    G.drawProfit = "HofudAction";
};

/**
 * <h3>Действия, связанные с дискардом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для дискарда по действию карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param suitId Id фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 * @returns {*}
 * @constructor
 */
export const DiscardSuitCard = (G, ctx, config, suitId, playerId, cardId) => {
    const discardedCard = G.players[ctx.playerID].cards[suitId].splice(cardId, 1)[0];
    G.discardCardsDeck.push(discardedCard);
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.playerID].nickname} сбросил карту ${discardedCard.name} 
    в дискард.`);
    EndActionForChosenPlayer(G, ctx, playerId);
};

/**
 * <h3>Выбор фракции для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
export const GetMjollnirProfitAction = (G, ctx, config, suitId) => {
    delete G.players[ctx.currentPlayer].buffs["getMjollnirProfit"];
    G.suitIdForMjollnir = suitId;
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} выбрал фракцию 
    ${Object.values(suitsConfig)[suitId].suitName} для эффекта артефакта Mjollnir.`);
    return EndActionFromStackAndAddNew(G, ctx);
};
