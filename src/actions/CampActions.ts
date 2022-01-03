import { Ctx } from "boardgame.io";
import { isArtefactCard } from "../Camp";
import { CreateCard } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { AddBuffToPlayer, DrawCurrentProfit, PickDiscardCard, PickCurrentHero, UpgradeCurrentCoin } from "../helpers/ActionHelpers";
import { AddCampCardToPlayerCards, AddCampCardToPlayer, AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction, CheckPickDiscardCard } from "../helpers/HeroHelpers";
import { EndActionFromStackAndAddNew, AddActionsToStackAfterCurrent, EndActionForChosenPlayer, AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { CampCardTypes, CampDeckCardTypes, PlayerCardsType, PickedCardType } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { Phases, RusCardTypes, ActionTypes, ConfigNames, DrawNames, LogTypes, HeroNames, Stages, SuitNames } from "../typescript/enums";
import { MyGameState, IConfig, IStack, IPublicPlayer, ICard, ICreateCard } from "../typescript/interfaces";
import { ArgsTypes } from "../typescript/types";

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
export const AddBuffToPlayerCampAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
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
export const AddCampCardToCardsAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    if (ctx.phase === Phases.PickCards && Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
        && ctx.activePlayers === null) {
        G.campPicked = true;
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime;
    }
    const campCard: CampCardTypes = G.camp[cardId];
    if (campCard !== null) {
        let suit: string | null = null,
            stack: IStack[] = [];
        G.camp[cardId] = null;
        if (isArtefactCard(campCard) && campCard.suit !== null) {
            AddCampCardToPlayerCards(G, ctx, campCard);
            CheckAndMoveThrudOrPickHeroAction(G, ctx, campCard);
            suit = campCard.suit;
        } else {
            AddCampCardToPlayer(G, ctx, campCard);
            if (ctx.phase === Phases.EnlistmentMercenaries && G.publicPlayers[Number(ctx.currentPlayer)].campCards
                .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY).length) {
                stack = [
                    {
                        action: {
                            name: DrawProfitCampAction.name,
                            type: ActionTypes.Camp,
                        },
                        config: {
                            name: ConfigNames.EnlistmentMercenaries,
                            drawName: DrawNames.EnlistmentMercenaries,
                        },
                    },
                ];
            }
        }
        EndActionFromStackAndAddNew(G, ctx, stack, suit);
    } else {
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
export const AddCoinToPouchAction = (G: MyGameState, ctx: Ctx, config: IConfig, coinId: number): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        tempId: number = player.boardCoins.findIndex((coin: CoinType, index: number): boolean =>
            index >= G.tavernsNum && coin === null),
        stack: IStack[] = [
            {
                action: {
                    name: StartVidofnirVedrfolnirAction.name,
                    type: ActionTypes.Camp,
                },
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
export const CheckPickDiscardCardCampAction = (G: MyGameState, ctx: Ctx): void => {
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
export const DiscardAnyCardFromPlayerBoardAction = (G: MyGameState, ctx: Ctx, config: IConfig, suit: string,
    cardId: number): void => {
    const discardedCard: PlayerCardsType =
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].splice(cardId, 1)[0];
    if (discardedCard.type !== RusCardTypes.HERO) {
        G.discardCardsDeck.push(discardedCard as ICard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} сбросил карту ${discardedCard.name} в дискард.`);
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.discardCardEndGame;
        EndActionFromStackAndAddNew(G, ctx);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`);
    }
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
export const DiscardSuitCardAction = (G: MyGameState, ctx: Ctx, config: IConfig, suit: string, playerId: number,
    cardId: number): void => {
    // Todo ctx.playerID === playerId???
    if (ctx.playerID !== undefined) {
        if (G.publicPlayers[playerId].cards[suit][cardId].type !== RusCardTypes.HERO) {
            const discardedCard: PlayerCardsType =
                G.publicPlayers[playerId].cards[suit].splice(cardId, 1)[0];
            G.discardCardsDeck.push(discardedCard as ICard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[playerId].nickname} сбросил карту ${discardedCard.name} в дискард.`);
            EndActionForChosenPlayer(G, ctx, playerId);
        } else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`);
        }
        // TODO Rework it for players and fix it for bots
        /*if (ctx.playerID !== ctx.currentPlayer) {
            const discardedCard: PlayerCardsType =
                G.publicPlayers[Number(ctx.playerID)].cards[suit].splice(cardId, 1)[0];
            G.discardCardsDeck.push(discardedCard as ICard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${ G.publicPlayers[Number(ctx.playerID)].nickname } сбросил карту ${ discardedCard.name } в дискард.`);
            EndActionForChosenPlayer(G, ctx, playerId);
        } else {*/
        //        }
    } else {
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
export const DiscardTradingCoinAction = (G: MyGameState, ctx: Ctx): void => {
    let tradingCoinIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex((coin: CoinType): boolean => Boolean(coin?.isTriggerTrading));
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
        && tradingCoinIndex === -1) {
        tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin: CoinType): boolean => Boolean(coin?.isTriggerTrading));
        G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .splice(tradingCoinIndex, 1, null);
    } else {
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
export const DrawProfitCampAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    DrawCurrentProfit(G, ctx, config);
};

/**
 * <h3>Игрок выбирает наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать наёмника для вербовки.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const GetEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY)[cardId];
    const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' выбрал наёмника '${pickedCard.name}'.`);
        const stack: IStack[] = [
            {
                action: {
                    name: DrawProfitCampAction.name,
                    type: ActionTypes.Camp,
                },
                config: {
                    name: ConfigNames.PlaceEnlistmentMercenaries,
                    drawName: DrawNames.PlaceEnlistmentMercenaries,
                },
            },
        ];
        EndActionFromStackAndAddNew(G, ctx, stack);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта наёмника.`);
    }
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
export const GetMjollnirProfitAction = (G: MyGameState, ctx: Ctx, config: IConfig, suit: string): void => {
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
export const PickDiscardCardCampAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
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
export const PickHeroCampAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    PickCurrentHero(G, ctx, config);
};

/**
 * <h3>Игрок выбирает фракцию для вербовки указанного наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать фракцию для вербовки наёмника.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 */
export const PlaceEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, suit: string): void => {
    const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        if (`stack` in pickedCard && `tier` in pickedCard && `path` in pickedCard) {
            if (pickedCard.stack[0].variants !== undefined) {
                const mercenaryCard: ICard = CreateCard({
                    type: RusCardTypes.MERCENARY,
                    suit,
                    rank: 1,
                    points: pickedCard.stack[0].variants[suit].points,
                    name: pickedCard.name,
                    tier: pickedCard.tier,
                    path: pickedCard.path,
                } as ICreateCard);
                AddCardToPlayer(G, ctx, mercenaryCard);
                AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' завербовал наёмника '${mercenaryCard.name}'.`);
                const cardIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .findIndex((card: CampDeckCardTypes): boolean => card.name === pickedCard.name);
                G.publicPlayers[Number(ctx.currentPlayer)].campCards.splice(cardIndex, 1);
                if (G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length) {
                    const stack: IStack[] = [
                        {
                            action: {
                                name: DrawProfitCampAction.name,
                                type: ActionTypes.Camp,
                            },
                            config: {
                                name: ConfigNames.EnlistmentMercenaries,
                                drawName: DrawNames.EnlistmentMercenaries,
                            },
                        },
                    ];
                    AddActionsToStackAfterCurrent(G, ctx, stack);
                }
                CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
                EndActionFromStackAndAddNew(G, ctx, [], suit);
            } else {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants'.`);
            }
        } else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Вместо карты наёмника пикнута карта другого типа.`);
        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта наёмника.`);
    }
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
export const StartDiscardSuitCardAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.suit !== undefined) {
        const value: { [index: number]: { stage: string; }; } = {};
        for (let i = 0; i < ctx.numPlayers; i++) {
            if (i !== Number(ctx.currentPlayer) && G.publicPlayers[i].cards[config.suit].length) {
                value[i] = {
                    stage: Stages.DiscardSuitCard,
                };
                const stack: IStack[] = [
                    {
                        action: {
                            name: DiscardSuitCardAction.name,
                            type: ActionTypes.Camp,
                        },
                        playerId: i,
                        config: {
                            suit: SuitNames.WARRIOR,
                        },
                    },
                ];
                AddActionsToStack(G, ctx, stack);
            }
        }
        ctx.events?.setActivePlayers({ value });
        G.drawProfit = ConfigNames.HofudAction;
    } else {
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
export const StartVidofnirVedrfolnirAction = (G: MyGameState, ctx: Ctx): void => {
    const number: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .filter((coin: CoinType, index: number): boolean =>
            index >= G.tavernsNum && coin === null).length,
        handCoinsNumber: number = G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length;
    let stack: IStack[] = [];
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline && number > 0
        && handCoinsNumber) {
        stack = [
            {
                action: {
                    name: DrawProfitCampAction.name,
                    type: ActionTypes.Camp,
                },
                config: {
                    name: ConfigNames.AddCoinToPouchVidofnirVedrfolnir,
                    stageName: Stages.AddCoinToPouch,
                    number: number,
                    drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                },
            },
            {
                action: {
                    name: AddCoinToPouchAction.name,
                    type: ActionTypes.Camp,
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    } else {
        let coinsValue = 0;
        for (let j: number = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length;
            j++) {
            if (!G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]?.isTriggerTrading) {
                coinsValue++;
            }
        }
        if (coinsValue === 1) {
            stack = [
                {
                    action: {
                        name: DrawProfitCampAction.name,
                        type: ActionTypes.Camp,
                    },
                    config: {
                        name: ConfigNames.VidofnirVedrfolnirAction,
                        stageName: Stages.UpgradeCoinVidofnirVedrfolnir,
                        value: 5,
                        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                    },
                },
                {
                    action: {
                        name: UpgradeCoinVidofnirVedrfolnirAction.name,
                        type: ActionTypes.Camp,
                    },
                    config: {
                        value: 5,
                    }
                },
            ];
        } else if (coinsValue === 2) {
            stack = [
                {
                    action: {
                        name: DrawProfitCampAction.name,
                        type: ActionTypes.Camp,
                    },
                    config: {
                        name: ConfigNames.VidofnirVedrfolnirAction,
                        stageName: Stages.UpgradeCoinVidofnirVedrfolnir,
                        number: 2,
                        value: 3,
                        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                    },
                },
                {
                    action: {
                        name: UpgradeCoinVidofnirVedrfolnirAction.name,
                        type: ActionTypes.Camp,
                    },
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
export const UpgradeCoinCampAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
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
export const UpgradeCoinVidofnirVedrfolnirAction = (G: MyGameState, ctx: Ctx, config: IConfig, coinId: number,
    type: string, isInitial: boolean): void => {
    const playerConfig: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    let stack: IStack[] = [];
    if (playerConfig !== undefined) {
        if (playerConfig.value === 3) {
            stack = [
                {
                    action: {
                        name: UpgradeCoinCampAction.name,
                        type: ActionTypes.Camp,
                    },
                    config: {
                        value: 3,
                    },
                },
                {
                    action: {
                        name: DrawProfitCampAction.name,
                        type: ActionTypes.Camp,
                    },
                    config: {
                        coinId,
                        name: ConfigNames.VidofnirVedrfolnirAction,
                        stageName: Stages.UpgradeCoinVidofnirVedrfolnir,
                        value: 2,
                        drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                    },
                },
                {
                    action: {
                        name: UpgradeCoinVidofnirVedrfolnirAction.name,
                        type: ActionTypes.Camp,
                    },
                    config: {
                        value: 2,
                    }
                },
            ];
        } else if (playerConfig.value === 2) {
            stack = [
                {
                    action: {
                        name: UpgradeCoinCampAction.name,
                        type: ActionTypes.Camp,
                    },
                    config: {
                        value: 2,
                    },
                },
            ];
        } else if (playerConfig.value === 5) {
            stack = [
                {
                    action: {
                        name: UpgradeCoinCampAction.name,
                        type: ActionTypes.Camp,
                    },
                    config: {
                        value: 5,
                    },
                },
            ];
        }
        AddActionsToStackAfterCurrent(G, ctx, stack);
        EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].config'.`);
    }
};
