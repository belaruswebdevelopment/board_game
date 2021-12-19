import { UpgradeCoin } from "../Coin";
import { INVALID_MOVE } from "boardgame.io/core";
import { SuitNames, suitsConfig } from "../data/SuitData";
import { AddCardToPlayer, IConfig, IStack, PickedCardType, PlayerCardsType } from "../Player";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { CreateCard, DiscardCardFromTavern, ICard, ICreateCard, isCardNotAction } from "../Card";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { AddDataToLog, LogTypes } from "../Logging";
import { CampDeckCardTypes, DeckCardTypes, MyGameState } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { IVariants } from "../data/HeroData";
import { IsStartActionStage } from "../helpers/ActionHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";

// todo Check my types
/**
 * <h3>Типы данных для рест аргументов функций.</h3>
 */
export type ArgsTypes = (string | number | boolean | null | object)[];

/**
 * <h3>Диспетчер действий при их активации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев выполняются последовательно их действия.</li>
 * <li>При выборе конкретных карт кэмпа выполняются последовательно их действия.</li>
 * <li>При выборе карт улучшения монет выполняются их действия.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Стэк.
 * @param args Дополнительные аргументы.
 */
export const ActionDispatcher = (G: MyGameState, ctx: Ctx, data: IStack, ...args: ArgsTypes): void => {
    data.action?.(G, ctx, data.config, ...args);
};

/**
 * <h3>Действия, связанные с улучшением монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих монеты.</li>
 * <li>При выборе карт улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
    UpgradeCoin(G, ctx, config, ...args as [number, string, boolean]);
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с отрисовкой профита.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawProfitAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен получить преимущества от действия '${config.drawName}'.`);
    IsStartActionStage(G, ctx, config);
    G.actionsNum = config.number ?? 1;
    if (config.name !== undefined) {
        G.drawProfit = config.name;
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найден обязательный параметр 'config.name'.`);
    }
};

/**
 * <h3>Действия, связанные с добавлением бафов игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddBuffToPlayerAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.buff !== undefined) {
        G.publicPlayers[Number(ctx.currentPlayer)].buffs[config.buff.name] = config.buff.value;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} получил баф '${config.buff.name}'.`);
        EndActionFromStackAndAddNew(G, ctx);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найден обязательный параметр 'config.buff'.`);
    }
};

/**
 * <h3>Действия, связанные с дискардом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дискардящих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number,
    cardId: number): void => {
    const pickedCard: PlayerCardsType = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId][cardId];
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = pickedCard;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту ${pickedCard.name}.`);
    // todo Artefact cards can be added to discard too OR make artefact card as created ICard?
    G.discardCardsDeck.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
        .splice(cardId, 1)[0] as ICard);
    if (G.actionsNum === 2) {
        const stack: IStack[] = [
            {
                action: DrawProfitAction,
                config: {
                    stageName: `discardCardFromBoard`,
                    drawName: `Dagda`,
                    name: `DagdaAction`,
                    suit: SuitNames.HUNTER,
                },
            },
            {
                action: DiscardCardsFromPlayerBoardAction,
                config: {
                    suit: SuitNames.HUNTER,
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Сбрасывает карту из таверны по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const DiscardCardFromTavernAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту из таверны:`);
    DiscardCardFromTavern(G, cardId);
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с возможностью дискарда карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность дискарда карт с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns
 */
export const CheckDiscardCardsFromPlayerBoardAction = (G: MyGameState, ctx: Ctx, config: IConfig): string | void => {
    const cardsToDiscard: PlayerCardsType[] = [];
    for (let i: number = 0; i < G.suitsNum; i++) {
        if (config.suit !== Object.keys(suitsConfig)[i]) {
            const last: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[i].length - 1;
            if (last >= 0 && G.publicPlayers[Number(ctx.currentPlayer)].cards[i][last].type !== `герой`) {
                cardsToDiscard.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[i][last]);
            }
        }
    }
    const isValidMove: boolean = cardsToDiscard.length >= (config.number ?? 1);
    if (!isValidMove) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих другие карты на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 */
export const PlaceCardsAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    const playerVariants: IVariants | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined) {
        const suit: string = Object.keys(suitsConfig)[suitId],
            olwinDouble: ICard = CreateCard({
                suit,
                rank: playerVariants[suit].rank,
                points: playerVariants[suit].points,
                name: `Olwin`,
            } as ICreateCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту Олвин во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, olwinDouble);
        if (G.actionsNum === 2) {
            const variants: IVariants = {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: 0,
                },
            },
                stack: IStack[] = [
                    {
                        action: DrawProfitAction,
                        variants,
                        config: {
                            name: `placeCards`,
                            stageName: `placeCards`,
                            drawName: `Olwin`,
                        },
                    },
                    {
                        action: PlaceCardsAction,
                        variants,
                    },
                ];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        CheckAndMoveThrudOrPickHeroAction(G, ctx, olwinDouble);
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найден обязательный параметр 'stack[0].variants'.`);
    }
};

/**
 * <h3>Действия, связанные с возможностью взятия карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickDiscardCardAction = (G: MyGameState, ctx: Ctx): void => {
    if (G.discardCardsDeck.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с взятием карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const PickDiscardCardAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    const isAdded: boolean = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]),
        pickedCard: DeckCardTypes = G.discardCardsDeck.splice(cardId, 1)[0];
    let suitId: number | null = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${pickedCard.name} из дискарда.`);
    if (G.actionsNum === 2 && G.discardCardsDeck.length > 0) {
        const stack: IStack[] = [
            {
                action: DrawProfitAction,
                config: {
                    stageName: `pickDiscardCard`,
                    name: `BrisingamensAction`,
                    drawName: `Brisingamens`,
                },
            },
            {
                action: PickDiscardCardAction,
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
            suitId = GetSuitIndexByName(pickedCard.suit);
            if (suitId === -1) {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найдена несуществующая фракция ${pickedCard.suit}.`);
            }
        }
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

/**
 * <h3>Первый игрок в фазе вербовки наёмников может пасануть, чтобы вербовать последним.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Может применятся первым игроком в фазе вербовки наёмников.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const PassEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} пасанул во время фазы 'Enlistment Mercenaries'.`);
    EndActionFromStackAndAddNew(G, ctx);
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
            .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`)[cardId];
    const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' выбрал наёмника '${pickedCard.name}'.`);
        const stack: IStack[] = [
            {
                action: DrawProfitAction,
                config: {
                    name: `placeEnlistmentMercenaries`,
                    drawName: `Place Enlistment Mercenaries`,
                },
            },
        ];
        EndActionFromStackAndAddNew(G, ctx, stack);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта наёмника.`);
    }
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
 * @param suitId Id фракции.
 */
export const PlaceEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    const suit: string = Object.keys(suitsConfig)[suitId],
        pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        if (`stack` in pickedCard && `tier` in pickedCard && `path` in pickedCard) {
            if (pickedCard.stack[0].variants !== undefined) {
                const mercenaryCard: ICard = CreateCard({
                    type: `наёмник`,
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
                    .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`).length) {
                    const stack: IStack[] = [
                        {
                            action: DrawProfitAction,
                            config: {
                                name: `enlistmentMercenaries`,
                                drawName: `Enlistment Mercenaries`,
                            },
                        },
                    ];
                    AddActionsToStackAfterCurrent(G, ctx, stack);
                }
                CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
                EndActionFromStackAndAddNew(G, ctx, [], suitId);
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
