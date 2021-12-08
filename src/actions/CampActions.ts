import {
    AddActionsToStack,
    AddActionsToStackAfterCurrent,
    EndActionForChosenPlayer,
    EndActionFromStackAndAddNew
} from "../helpers/StackHelpers";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {
    AddCampCardToPlayer,
    AddCampCardToPlayerCards,
    IConfig,
    IPublicPlayer,
    IStack,
    PlayerCardsType
} from "../Player";
import {CheckAndMoveThrudOrPickHeroAction} from "./HeroActions";
import {AddDataToLog, LogTypes} from "../Logging";
import {SuitNames, suitsConfig} from "../data/SuitData";
import {CampDeckCardTypes, MyGameState} from "../GameSetup";
import {Ctx} from "boardgame.io";
import {isArtefactCard} from "../Camp";
import {ICard} from "../Card";
import {ICoin} from "../Coin";

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
export const CheckPickCampCard = (G: MyGameState, ctx: Ctx): void => {
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
export const AddCampCardToCards = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    if (ctx.phase === "pickCards" && Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
        && ctx.activePlayers === null) {
        G.campPicked = true;
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime;
    }
    const campCard: CampDeckCardTypes | null = G.camp[cardId];
    let suitId: number | null = null,
        stack: IStack[] = [];
    G.camp[cardId] = null;
    if (campCard !== null) {
        if (isArtefactCard(campCard)) {
            AddCampCardToPlayerCards(G, ctx, campCard);
            CheckAndMoveThrudOrPickHeroAction(G, ctx, campCard);
            suitId = GetSuitIndexByName(campCard.suit);
        } else {
            AddCampCardToPlayer(G, ctx, campCard);
            if (ctx.phase === "enlistmentMercenaries"
                && G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник").length) {
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
export const AddCoinToPouchAction = (G: MyGameState, ctx: Ctx, config: IConfig, coinId: number): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        tempId: number = player.boardCoins
            .findIndex((coin: ICoin | null, index: number): boolean => index >= G.tavernsNum && coin === null),
        stack: IStack[] = [
            {
                actionName: "StartVidofnirVedrfolnirAction",
            },
        ];
    player.boardCoins[tempId] = player.handCoins[coinId];
    player.handCoins[coinId] = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    положил монету ценностью '${player.boardCoins[tempId]}' в свой кошелёк.`);
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
export const StartVidofnirVedrfolnirAction = (G: MyGameState, ctx: Ctx): void => {
    const number: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter((coin: ICoin | null, index: number): boolean => index >= G.tavernsNum && coin === null).length,
        handCoinsNumber: number = G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length;
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && number > 0 && handCoinsNumber) {
        const stack: IStack[] = [
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
        let coinsValue: number = 0,
            stack: IStack[] = [];
        for (let j: number = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            if (!G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]?.isTriggerTrading) {
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
export const UpgradeCoinVidofnirVedrfolnirAction = (G: MyGameState, ctx: Ctx, config: IConfig, coinId: number,
                                                    type: string, isInitial: boolean): void => {
    const playerConfig: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    let stack: IStack[] = [];
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
        } else if (playerConfig.value === 2) {
            stack = [
                {
                    actionName: "UpgradeCoinAction",
                    config: {
                        value: 2,
                    },
                },
            ];
        } else if (playerConfig.value === 5) {
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
export const DiscardTradingCoin = (G: MyGameState, ctx: Ctx): void => {
    let tradingCoinIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex((coin: ICoin | null): boolean => Boolean(coin?.isTriggerTrading));
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && tradingCoinIndex === -1) {
        tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin: ICoin | null): boolean => Boolean(coin?.isTriggerTrading));
        G.publicPlayers[Number(ctx.currentPlayer)].handCoins.splice(tradingCoinIndex, 1, null);
    } else {
        G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.splice(tradingCoinIndex, 1, null);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    сбросил монету активирующую обмен.`);
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
export const DiscardAnyCardFromPlayerBoard = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number,
                                              cardId: number): void => {
    const discardedCard: PlayerCardsType =
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].splice(cardId, 1)[0];
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    сбросил карту ${discardedCard.name} в дискард.`);
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
export const StartDiscardSuitCard = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.suit !== undefined) {
        const suitId: number = GetSuitIndexByName(config.suit),
            value: { [index: number]: { stage: string } } = {};
        for (let i: number = 0; i < ctx.numPlayers; i++) {
            if (i !== Number(ctx.currentPlayer) && G.publicPlayers[i].cards[suitId].length) {
                value[i] = {
                    stage: "discardSuitCard",
                };
                const stack: IStack[] = [
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
        ctx.events!.setActivePlayers!({
            value,
        });
        G.drawProfit = "HofudAction";
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
export const DiscardSuitCard = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number, playerId: number,
                                cardId: number): void => {
    if (ctx.playerID !== undefined) {
        const discardedCard: PlayerCardsType =
            G.publicPlayers[Number(ctx.playerID)].cards[suitId].splice(cardId, 1)[0];
        G.discardCardsDeck.push(discardedCard as ICard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.playerID)].nickname} 
        сбросил карту ${discardedCard.name} в дискард.`);
        EndActionForChosenPlayer(G, ctx, playerId);
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
export const GetMjollnirProfitAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.getMjollnirProfit;
    G.suitIdForMjollnir = suitId;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    выбрал фракцию ${Object.values(suitsConfig)[suitId].suitName} для эффекта артефакта Mjollnir.`);
    EndActionFromStackAndAddNew(G, ctx);
};
