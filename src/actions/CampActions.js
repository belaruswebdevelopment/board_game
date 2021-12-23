import { AddActionsToStack, AddActionsToStackAfterCurrent, EndActionForChosenPlayer, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { AddCampCardToPlayer, AddCampCardToPlayerCards } from "../Player";
import { AddDataToLog, LogTypes } from "../Logging";
import { SuitNames, suitsConfig } from "../data/SuitData";
import { isArtefactCard } from "../Camp";
import { RusCardTypes } from "../Card";
import { CheckAndMoveThrudOrPickHeroAction, CheckPickDiscardCard } from "../helpers/HeroHelpers";
import { AddBuffToPlayer, DrawCurrentProfit, PickCurrentHero, PickDiscardCard, UpgradeCurrentCoin } from "../helpers/ActionHelpers";
import { DrawNames } from "./Actions";
import { Phases, Stages } from "../Game";
/**
 * <h3>Действия, связанные с добавлением бафов от артефактов игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных артефактов, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddBuffToPlayerCampAction = (G, ctx, config) => {
    AddBuffToPlayer(G, ctx, config);
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
 */
export const AddCampCardToCardsAction = (G, ctx, config, cardId) => {
    if (ctx.phase === Phases.PickCards && Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
        && ctx.activePlayers === null) {
        G.campPicked = true;
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime;
    }
    const campCard = G.camp[cardId];
    if (campCard !== null) {
        let suit = null, stack = [];
        G.camp[cardId] = null;
        if (isArtefactCard(campCard) && campCard.suit !== null) {
            AddCampCardToPlayerCards(G, ctx, campCard);
            CheckAndMoveThrudOrPickHeroAction(G, ctx, campCard);
            suit = campCard.suit;
        }
        else {
            AddCampCardToPlayer(G, ctx, campCard);
            if (ctx.phase === Phases.EnlistmentMercenaries && G.publicPlayers[Number(ctx.currentPlayer)].campCards
                .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
                stack = [
                    {
                        action: DrawProfitCampAction.name,
                        config: {
                            name: `enlistmentMercenaries`,
                            drawName: DrawNames.EnlistmentMercenaries,
                        },
                    },
                ];
            }
        }
        EndActionFromStackAndAddNew(G, ctx, stack, suit);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта кэмпа.`);
    }
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
 */
export const AddCoinToPouchAction = (G, ctx, config, coinId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], tempId = player.boardCoins
        .findIndex((coin, index) => index >= G.tavernsNum && coin === null), stack = [
        {
            action: StartVidofnirVedrfolnirAction.name,
        },
    ];
    player.boardCoins[tempId] = player.handCoins[coinId];
    player.handCoins[coinId] = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} положил монету ценностью '${player.boardCoins[tempId]}' в свой кошелёк.`);
    AddActionsToStackAfterCurrent(G, ctx, stack);
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с возможностью взятия карт из дискарда от карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных карт кэмпа, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickDiscardCardCampAction = (G, ctx) => {
    CheckPickDiscardCard(G, ctx);
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
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardAnyCardFromPlayerBoardAction = (G, ctx, config, suit, cardId) => {
    const discardedCard = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].splice(cardId, 1)[0];
    G.discardCardsDeck.push(discardedCard);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} сбросил карту ${discardedCard.name} в дискард.`);
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.discardCardEndGame;
    EndActionFromStackAndAddNew(G, ctx);
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
 * @param suit Название фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G, ctx, config, suit, playerId, cardId) => {
    // Todo ctx.playerID === playerId???
    if (ctx.playerID !== undefined) {
        // TODO Rework it for players and fix it for bots
        /*if (ctx.playerID !== ctx.currentPlayer) {
            const discardedCard: PlayerCardsType =
                G.publicPlayers[Number(ctx.playerID)].cards[suit].splice(cardId, 1)[0];
            G.discardCardsDeck.push(discardedCard as ICard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${ G.publicPlayers[Number(ctx.playerID)].nickname } сбросил карту ${ discardedCard.name } в дискард.`);
            EndActionForChosenPlayer(G, ctx, playerId);
        } else {*/
        const discardedCard = G.publicPlayers[playerId].cards[suit].splice(cardId, 1)[0];
        G.discardCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[playerId].nickname} сбросил карту ${discardedCard.name} в дискард.`);
        EndActionForChosenPlayer(G, ctx, playerId);
        //        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'ctx.playerID'.`);
    }
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
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === `Uline` && tradingCoinIndex === -1) {
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
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с отрисовкой профита от карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных карт кэмпа, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawProfitCampAction = (G, ctx, config) => {
    DrawCurrentProfit(G, ctx, config);
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
 * @param suit Название фракции.
 */
export const GetMjollnirProfitAction = (G, ctx, config, suit) => {
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.getMjollnirProfit;
    G.suitIdForMjollnir = suit;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал фракцию ${suitsConfig[suit].suitName} для эффекта артефакта Mjollnir.`);
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с взятием карт из дискарда от карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных карт кэмпа, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const PickDiscardCardCampAction = (G, ctx, config, cardId) => {
    PickDiscardCard(G, ctx, config, cardId);
};
/**
 * <h3>Действия, связанные с взятием героя от артефактов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const PickHeroCampAction = (G, ctx, config) => {
    PickCurrentHero(G, ctx, config);
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
 * @param config Конфиг действий артефакта.
 */
export const StartDiscardSuitCardAction = (G, ctx, config) => {
    if (config.suit !== undefined) {
        const value = {};
        for (let i = 0; i < ctx.numPlayers; i++) {
            if (i !== Number(ctx.currentPlayer) && G.publicPlayers[i].cards[config.suit].length) {
                value[i] = {
                    stage: Stages.DiscardSuitCard,
                };
                const stack = [
                    {
                        action: DiscardSuitCardAction.name,
                        playerId: i,
                        config: {
                            suit: SuitNames.WARRIOR,
                        },
                    },
                ];
                AddActionsToStack(G, ctx, stack);
            }
        }
        ctx.events.setActivePlayers({ value });
        G.drawProfit = `HofudAction`;
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
    let stack = [];
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && number > 0 && handCoinsNumber) {
        stack = [
            {
                action: DrawProfitCampAction.name,
                config: {
                    name: `AddCoinToPouchVidofnirVedrfolnir`,
                    stageName: Stages.AddCoinToPouch,
                    number: number,
                    drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                },
            },
            {
                action: AddCoinToPouchAction.name,
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    else {
        let coinsValue = 0;
        for (let j = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            if (!((_a = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
                coinsValue++;
            }
        }
        if (coinsValue === 1) {
            stack = [
                {
                    action: DrawProfitCampAction.name,
                    config: {
                        name: `VidofnirVedrfolnirAction`,
                        stageName: Stages.UpgradeCoinVidofnirVedrfolnir,
                        value: 5,
                        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                    },
                },
                {
                    action: UpgradeCoinVidofnirVedrfolnirAction.name,
                    config: {
                        value: 5,
                    }
                },
            ];
        }
        else if (coinsValue === 2) {
            stack = [
                {
                    action: DrawProfitCampAction.name,
                    config: {
                        name: `VidofnirVedrfolnirAction`,
                        stageName: Stages.UpgradeCoinVidofnirVedrfolnir,
                        number: 2,
                        value: 3,
                        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                    },
                },
                {
                    action: UpgradeCoinVidofnirVedrfolnirAction.name,
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
 * <h3>Действия, связанные с улучшением монет от карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных карт кэмпа, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinCampAction = (G, ctx, config, ...args) => {
    UpgradeCurrentCoin(G, ctx, config, ...args);
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
 */
export const UpgradeCoinVidofnirVedrfolnirAction = (G, ctx, config, coinId, type, isInitial) => {
    const playerConfig = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    let stack = [];
    if (playerConfig !== undefined) {
        if (playerConfig.value === 3) {
            stack = [
                {
                    action: UpgradeCoinCampAction.name,
                    config: {
                        value: 3,
                    },
                },
                {
                    action: DrawProfitCampAction.name,
                    config: {
                        coinId,
                        name: `VidofnirVedrfolnirAction`,
                        stageName: Stages.UpgradeCoinVidofnirVedrfolnir,
                        value: 2,
                        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                    },
                },
                {
                    action: UpgradeCoinVidofnirVedrfolnirAction.name,
                    config: {
                        value: 2,
                    }
                },
            ];
        }
        else if (playerConfig.value === 2) {
            stack = [
                {
                    action: UpgradeCoinCampAction.name,
                    config: {
                        value: 2,
                    },
                },
            ];
        }
        else if (playerConfig.value === 5) {
            stack = [
                {
                    action: UpgradeCoinCampAction.name,
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
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].config'.`);
    }
};
