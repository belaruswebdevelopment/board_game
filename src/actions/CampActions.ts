import {
    AddActionsToStack,
    AddActionsToStackAfterCurrent,
    EndActionForChosenPlayer,
    EndActionFromStackAndAddNew
} from "../helpers/StackHelpers";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import {
    AddCampCardToPlayer,
    AddCampCardToPlayerCards,
    IConfig,
    IPublicPlayer,
    IStack,
    PlayerCardsType
} from "../Player";
import { AddDataToLog, LogTypes } from "../Logging";
import { SuitNames, suitsConfig } from "../data/SuitData";
import { CampDeckCardTypes, MyGameState } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { isArtefactCard } from "../Camp";
import { ICard } from "../Card";
import { ICoin } from "../Coin";
import { CheckAndMoveThrudOrPickHeroAction, CheckPickDiscardCard } from "../helpers/HeroHelpers";
import {
    AddBuffToPlayer,
    DrawCurrentProfit,
    PickCurrentHero,
    PickDiscardCard,
    UpgradeCurrentCoin
} from "../helpers/ActionHelpers";
import { ArgsTypes } from "./Actions";

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
// export const UpgradeCoinCampAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
//     UpgradeCurrentCoin(G, ctx, config, ...args);
// };

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
    if (ctx.phase === "pickCards" && Number(ctx.currentPlayer) === G.publicPlayersOrder[0]
        && ctx.activePlayers === null) {
        G.campPicked = true;
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime;
    }
    const campCard: CampDeckCardTypes | null = G.camp[cardId];
    if (campCard !== null) {
        let suitId: number | null = null,
            stack: IStack[] = [];
        G.camp[cardId] = null;
        if (isArtefactCard(campCard) && campCard.suit !== null) {
            AddCampCardToPlayerCards(G, ctx, campCard);
            CheckAndMoveThrudOrPickHeroAction(G, ctx, campCard);
            suitId = GetSuitIndexByName(campCard.suit);
            if (suitId !== -1) {
                // todo ???
            } else {
                // todo ???
            }
        } else {
            AddCampCardToPlayer(G, ctx, campCard);
            if (ctx.phase === `enlistmentMercenaries` && G.publicPlayers[Number(ctx.currentPlayer)].campCards
                .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`).length) {
                stack = [
                    {
                        action: DrawProfitCampAction.name,
                        config: {
                            name: `enlistmentMercenaries`,
                            drawName: `Enlistment Mercenaries`,
                        },
                    },
                ];
            }
        }
        EndActionFromStackAndAddNew(G, ctx, stack, suitId);
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
        tempId: number = player.boardCoins
            .findIndex((coin: ICoin | null, index: number): boolean =>
                index >= G.tavernsNum && coin === null),
        stack: IStack[] = [
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
        .filter((coin: ICoin | null, index: number): boolean =>
            index >= G.tavernsNum && coin === null).length,
        handCoinsNumber: number = G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length;
    let stack: IStack[] = [];
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && number > 0 && handCoinsNumber) {
        stack = [
            {
                action: DrawProfitCampAction.name,
                config: {
                    name: `AddCoinToPouchVidofnirVedrfolnir`,
                    stageName: `addCoinToPouch`,
                    number: number,
                    drawName: `Add coin to pouch Vidofnir Vedrfolnir`,
                },
            },
            {
                action: AddCoinToPouchAction.name,
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    } else {
        let coinsValue: number = 0;
        for (let j: number = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            if (!G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]?.isTriggerTrading) {
                coinsValue++;
            }
        }
        if (coinsValue === 1) {
            stack = [
                {
                    action: DrawProfitCampAction.name,
                    config: {
                        name: `VidofnirVedrfolnirAction`,
                        stageName: `upgradeCoinVidofnirVedrfolnir`,
                        value: 5,
                        drawName: `Upgrade coin Vidofnir Vedrfolnir`,
                    },
                },
                {
                    action: UpgradeCoinVidofnirVedrfolnirAction.name,
                    config: {
                        value: 5,
                    }
                },
            ];
        } else if (coinsValue === 2) {
            stack = [
                {
                    action: DrawProfitCampAction.name,
                    config: {
                        name: `VidofnirVedrfolnirAction`,
                        stageName: `upgradeCoinVidofnirVedrfolnir`,
                        number: 2,
                        value: 3,
                        drawName: `Upgrade coin Vidofnir Vedrfolnir`,
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
                    // action: UpgradeCoinCampAction.name,
                    action: `UpgradeCoinCampAction`,
                    config: {
                        value: 3,
                    },
                },
                {
                    action: DrawProfitCampAction.name,
                    config: {
                        coinId,
                        name: `VidofnirVedrfolnirAction`,
                        stageName: `upgradeCoinVidofnirVedrfolnir`,
                        value: 2,
                        drawName: `Upgrade coin Vidofnir Vedrfolnir`,
                    },
                },
                {
                    action: UpgradeCoinVidofnirVedrfolnirAction.name,
                    config: {
                        value: 2,
                    }
                },
            ];
        } else if (playerConfig.value === 2) {
            stack = [
                {
                    // action: UpgradeCoinCampAction.name,
                    action: `UpgradeCoinCampAction`,
                    config: {
                        value: 2,
                    },
                },
            ];
        } else if (playerConfig.value === 5) {
            stack = [
                {
                    // action: UpgradeCoinCampAction.name,
                    action: `UpgradeCoinCampAction`,
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
        .findIndex((coin: ICoin | null): boolean => Boolean(coin?.isTriggerTrading));
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline" && tradingCoinIndex === -1) {
        tradingCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin: ICoin | null): boolean => Boolean(coin?.isTriggerTrading));
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
 */
export const DiscardAnyCardFromPlayerBoardAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number,
    cardId: number): void => {
    const discardedCard: PlayerCardsType =
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].splice(cardId, 1)[0];
    G.discardCardsDeck.push(discardedCard as ICard);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} сбросил карту ${discardedCard.name} в дискард.`);
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
 * @param G
 * @param ctx
 * @param config Конфиг действий артефакта.
 */
export const StartDiscardSuitCardAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.suit !== undefined) {
        const suitId: number = GetSuitIndexByName(config.suit),
            value: { [index: number]: { stage: string; }; } = {};
        for (let i: number = 0; i < ctx.numPlayers; i++) {
            if (i !== Number(ctx.currentPlayer) && G.publicPlayers[i].cards[suitId].length) {
                value[i] = {
                    stage: `discardSuitCard`,
                };
                const stack: IStack[] = [
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
        ctx.events!.setActivePlayers!({ value });
        G.drawProfit = `HofudAction`;
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.suit'.`);
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
 * @param suitId Id фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number, playerId: number,
    cardId: number): void => {
    // Todo ctx.playerID === playerId???
    if (ctx.playerID !== undefined) {
        // TODO Rework it for players and fix it for bots
        /*if (ctx.playerID !== ctx.currentPlayer) {
            const discardedCard: PlayerCardsType =
                G.publicPlayers[Number(ctx.playerID)].cards[suitId].splice(cardId, 1)[0];
            G.discardCardsDeck.push(discardedCard as ICard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${ G.publicPlayers[Number(ctx.playerID)].nickname } сбросил карту ${ discardedCard.name } в дискард.`);
            EndActionForChosenPlayer(G, ctx, playerId);
        } else {*/
        const discardedCard: PlayerCardsType =
            G.publicPlayers[playerId].cards[suitId].splice(cardId, 1)[0];
        G.discardCardsDeck.push(discardedCard as ICard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[playerId].nickname} сбросил карту ${discardedCard.name} в дискард.`);
        EndActionForChosenPlayer(G, ctx, playerId);
        //        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'ctx.playerID'.`);
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
 * @param suitId Id фракции.
 */
export const GetMjollnirProfitAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.getMjollnirProfit;
    G.suitIdForMjollnir = suitId;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал фракцию ${Object.values(suitsConfig)[suitId].suitName} для эффекта артефакта Mjollnir.`);
    EndActionFromStackAndAddNew(G, ctx);
};
