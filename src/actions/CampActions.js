import { AddActionsToStack, AddActionsToStackAfterCurrent, EndActionForChosenPlayer, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { AddCampCardToPlayer, AddCampCardToPlayerCards } from "../Player";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroActions";
import { AddDataToLog, LogTypes } from "../Logging";
import { SuitNames, suitsConfig } from "../data/SuitData";
import { isArtefactCard } from "../Camp";
/**
 * <h3>Действия, связанные с возможностью взятия карт из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из кэмпа.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export var CheckPickCampCard = function (G, ctx) {
    if (G.camp.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с добавлением карт кэмпа в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, добавляющихся на планшет игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий артефакта.
 * @param {number} cardId Id карты.
 * @constructor
 */
export var AddCampCardToCards = function (G, ctx, config, cardId) {
    if (ctx.phase === "pickCards" && Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
        && ctx.activePlayers === null) {
        G.campPicked = true;
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime;
    }
    var campCard = G.camp[cardId];
    if (campCard !== null) {
        var suitId = null, stack = [];
        G.camp[cardId] = null;
        if (isArtefactCard(campCard) && campCard.suit !== null) {
            AddCampCardToPlayerCards(G, ctx, campCard);
            CheckAndMoveThrudOrPickHeroAction(G, ctx, campCard);
            suitId = GetSuitIndexByName(campCard.suit);
            if (suitId !== -1) {
                // todo ???
            }
            else {
                // todo ???
            }
        }
        else {
            AddCampCardToPlayer(G, ctx, campCard);
            if (ctx.phase === "enlistmentMercenaries"
                && G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter(function (card) { return card.type === "наёмник"; }).length) {
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
        EndActionFromStackAndAddNew(G, ctx, stack, suitId);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не пикнута карта кэмпа.");
    }
};
/**
 * <h3>Действия, связанные с добавлением монет в кошелёк для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий артефакта.
 * @param {number} coinId Id монеты.
 * @constructor
 */
export var AddCoinToPouchAction = function (G, ctx, config, coinId) {
    var player = G.publicPlayers[Number(ctx.currentPlayer)], tempId = player.boardCoins
        .findIndex(function (coin, index) { return index >= G.tavernsNum && coin === null; }), stack = [
        {
            actionName: "StartVidofnirVedrfolnirAction",
        },
    ];
    player.boardCoins[tempId] = player.handCoins[coinId];
    player.handCoins[coinId] = null;
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u043F\u043E\u043B\u043E\u0436\u0438\u043B \u043C\u043E\u043D\u0435\u0442\u0443 \u0446\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E '").concat(player.boardCoins[tempId], "' \u0432 \u0441\u0432\u043E\u0439 \u043A\u043E\u0448\u0435\u043B\u0451\u043A."));
    AddActionsToStackAfterCurrent(G, ctx, stack);
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте способности карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export var StartVidofnirVedrfolnirAction = function (G, ctx) {
    var _a;
    var number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .filter(function (coin, index) { return index >= G.tavernsNum && coin === null; }).length, handCoinsNumber = G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length;
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && number > 0 && handCoinsNumber) {
        var stack = [
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
    }
    else {
        var coinsValue = 0, stack = [];
        for (var j = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            if (!((_a = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
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
        }
        else if (coinsValue === 2) {
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
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий артефакта.
 * @param {number} coinId Id монеты.
 * @param {string} type Тип монеты.
 * @param {boolean} isInitial Является ли монета базовой.
 * @constructor
 */
export var UpgradeCoinVidofnirVedrfolnirAction = function (G, ctx, config, coinId, type, isInitial) {
    var playerConfig = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    var stack = [];
    if (playerConfig !== undefined) {
        if (playerConfig.value === 3) {
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
                        coinId: coinId,
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
        }
        else if (playerConfig.value === 2) {
            stack = [
                {
                    actionName: "UpgradeCoinAction",
                    config: {
                        value: 2,
                    },
                },
            ];
        }
        else if (playerConfig.value === 5) {
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
        EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'stack[0].config'.");
    }
};
/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export var DiscardTradingCoin = function (G, ctx) {
    var tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex(function (coin) { return Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading); });
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && tradingCoinIndex === -1) {
        tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex(function (coin) { return Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading); });
        G.publicPlayers[Number(ctx.currentPlayer)].handCoins.splice(tradingCoinIndex, 1, null);
    }
    else {
        G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.splice(tradingCoinIndex, 1, null);
    }
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0441\u0431\u0440\u043E\u0441\u0438\u043B \u043C\u043E\u043D\u0435\u0442\u0443 \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u0443\u044E\u0449\u0443\u044E \u043E\u0431\u043C\u0435\u043D."));
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные со сбросом любой указанной карты со стола игрока в дискард.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий артефакта.
 * @param {number} suitId Id фракции.
 * @param {number} cardId Id карты.
 * @constructor
 */
export var DiscardAnyCardFromPlayerBoard = function (G, ctx, config, suitId, cardId) {
    var discardedCard = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].splice(cardId, 1)[0];
    G.discardCardsDeck.push(discardedCard);
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0441\u0431\u0440\u043E\u0441\u0438\u043B \u043A\u0430\u0440\u0442\u0443 ").concat(discardedCard.name, " \u0432 \u0434\u0438\u0441\u043A\u0430\u0440\u0434."));
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.discardCardEndGame;
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Старт действия, связанные с дискардом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий артефакта.
 * @constructor
 */
export var StartDiscardSuitCard = function (G, ctx, config) {
    if (config.suit !== undefined) {
        var suitId = GetSuitIndexByName(config.suit), value = {};
        for (var i = 0; i < ctx.numPlayers; i++) {
            if (i !== Number(ctx.currentPlayer) && G.publicPlayers[i].cards[suitId].length) {
                value[i] = {
                    stage: "discardSuitCard",
                };
                var stack = [
                    {
                        actionName: "DiscardSuitCard",
                        playerId: i,
                        config: {
                            suit: SuitNames.WARRIOR,
                        },
                    },
                ];
                AddActionsToStack(G, ctx, stack);
            }
        }
        ctx.events.setActivePlayers({
            value: value,
        });
        G.drawProfit = "HofudAction";
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'config.suit'.");
    }
};
/**
 * <h3>Действия, связанные с дискардом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для дискарда по действию карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий артефакта.
 * @param {number} suitId Id фракции.
 * @param {number} playerId Id игрока.
 * @param {number} cardId Id сбрасываемой карты.
 * @constructor
 */
export var DiscardSuitCard = function (G, ctx, config, suitId, playerId, cardId) {
    // Todo ctx.playerID === playerId???
    if (ctx.playerID !== undefined) {
        // TODO Rework it for players and fix it for bots
        /*if (ctx.playerID !== ctx.currentPlayer) {
            const discardedCard: PlayerCardsType =
                G.publicPlayers[Number(ctx.playerID)].cards[suitId].splice(cardId, 1)[0];
            G.discardCardsDeck.push(discardedCard as ICard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.playerID)].nickname}
            сбросил карту ${discardedCard.name} в дискард.`);
            EndActionForChosenPlayer(G, ctx, playerId);
        } else {*/
        var discardedCard = G.publicPlayers[playerId].cards[suitId].splice(cardId, 1)[0];
        G.discardCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[playerId].nickname, " \n            \u0441\u0431\u0440\u043E\u0441\u0438\u043B \u043A\u0430\u0440\u0442\u0443 ").concat(discardedCard.name, " \u0432 \u0434\u0438\u0441\u043A\u0430\u0440\u0434."));
        EndActionForChosenPlayer(G, ctx, playerId);
        //        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не передан обязательный параметр 'ctx.playerID'.");
    }
};
/**
 * <h3>Выбор фракции для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий артефакта.
 * @param {number} suitId Id фракции.
 * @constructor
 */
export var GetMjollnirProfitAction = function (G, ctx, config, suitId) {
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.getMjollnirProfit;
    G.suitIdForMjollnir = suitId;
    AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n    \u0432\u044B\u0431\u0440\u0430\u043B \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(Object.values(suitsConfig)[suitId].suitName, " \u0434\u043B\u044F \u044D\u0444\u0444\u0435\u043A\u0442\u0430 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442\u0430 Mjollnir."));
    EndActionFromStackAndAddNew(G, ctx);
};
