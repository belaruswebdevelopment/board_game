import { SuitNames, suitsConfig } from "../data/SuitData";
import { CreateCard, ICard, ICreateCard } from "../Card";
import {
    AddCardToPlayer,
    AddHeroCardToPlayerCards,
    AddHeroCardToPlayerHeroCards,
    IConfig,
    IStack,
    PlayerCardsType
} from "../Player";
import { CheckPickHero, IHero } from "../Hero";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { ICoin, ReturnCoinToPlayerHands } from "../Coin";
import { CheckAndMoveThrudOrPickHeroAction, CheckPickDiscardCard, GetHeroIndexByName } from "../helpers/HeroHelpers";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddDataToLog, LogTypes } from "../Logging";
import { TotalRank } from "../helpers/ScoreHelpers";
import { MyGameState } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { IConditions, IVariants } from "../data/HeroData";
import {
    AddBuffToPlayer,
    DrawCurrentProfit,
    IsStartActionStage,
    PickDiscardCard,
    UpgradeCurrentCoin
} from "../helpers/ActionHelpers";
import { ArgsTypes } from "./Actions";

/**
 * <h3>Действия, связанные с улучшением монет от героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
    UpgradeCurrentCoin(G, ctx, config, ...args);
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
                action: DrawProfitHeroAction.name,
                config: {
                    stageName: `discardCardFromBoard`,
                    drawName: `Dagda`,
                    name: `DagdaAction`,
                    suit: SuitNames.HUNTER,
                },
            },
            {
                action: DiscardCardsFromPlayerBoardAction.name,
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
 * <h3>Действия, связанные с возможностью взятия карт из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickCampCardAction = (G: MyGameState, ctx: Ctx): void => {
    if (G.camp.length === 0) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с отрисовкой профита от героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawProfitHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    DrawCurrentProfit(G, ctx, config);
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
                        action: DrawProfitHeroAction.name,
                        variants,
                        config: {
                            name: `placeCards`,
                            stageName: `placeCards`,
                            drawName: `Olwin`,
                        },
                    },
                    {
                        action: PlaceCardsAction.name,
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
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровом поле игрока.</li>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 */
export const PlaceHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    const suit: string = Object.keys(suitsConfig)[suitId],
        playerVariants: IVariants | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined && config.name !== undefined) {
        const heroCard: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: `герой`,
            name: config.name,
            game: `base`,
        } as ICreateCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${config.name} во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, heroCard);
        CheckPickHero(G, ctx);
        EndActionFromStackAndAddNew(G, ctx);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants' или не передан обязательный параметр 'stack[0].config.name'.`);
    }
};

/**
 * <h3>Действия, связанные с возможностью взятия карт из дискарда от героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickDiscardCardHeroAction = (G: MyGameState, ctx: Ctx): void => {
    CheckPickDiscardCard(G, ctx);
};

/**
 * <h3>Действия, связанные с взятием карт из дискарда от героев.</h3>
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
export const PickDiscardCardHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    PickDiscardCard(G, ctx, config, cardId);
};

/**
 * <h3>Действия, связанные с добавлением бафов от героев игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddHeroBuffToPlayerAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    AddBuffToPlayer(G, ctx, config);
};

/**
 * <h3>Действия, связанные с добавлением героев в массив карт игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddHeroToCardsAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.drawName) {
        const heroIndex: number = GetHeroIndexByName(config.drawName),
            hero: IHero = G.heroes[heroIndex];
        let suitId: number | null = null;
        AddHeroCardToPlayerHeroCards(G, ctx, hero);
        AddHeroCardToPlayerCards(G, ctx, hero);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
        if (hero.suit !== null) {
            suitId = GetSuitIndexByName(hero.suit);
            if (suitId === -1) {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найдена несуществующая фракция ${hero.suit}.`);
            }
        }
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.drawName'.`);
    }
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
export const GetClosedCoinIntoPlayerHandAction = (G: MyGameState, ctx: Ctx): void => {
    const coinsCount: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length,
        tradingBoardCoinIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .findIndex((coin: ICoin | null): boolean => Boolean(coin?.isTriggerTrading)),
        tradingHandCoinIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin: ICoin | null): boolean => Boolean(coin?.isTriggerTrading));
    for (let i: number = 0; i < coinsCount; i++) {
        if ((i < G.tavernsNum && G.currentTavern < i) || (i >= G.tavernsNum && tradingHandCoinIndex !== -1)
            || (i >= G.tavernsNum && tradingBoardCoinIndex >= G.currentTavern)) {
            ReturnCoinToPlayerHands(G.publicPlayers[Number(ctx.currentPlayer)], i);
        }
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с выбором героев по определённым условиям.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, получаемых по определённым условиям.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns
 */
export const PickHeroWithConditionsAction = (G: MyGameState, ctx: Ctx, config: IConfig): string | void => {
    let isValidMove: boolean = false;
    for (const condition in config.conditions) {
        if (config.conditions.hasOwnProperty(condition)) {
            if (condition === `suitCountMin`) {
                let ranks: number = 0;
                for (const key in (config.conditions as IConditions)[condition]) {
                    if (config.conditions[condition].hasOwnProperty(key)) {
                        if (key === `suit`) {
                            const suitId: number = GetSuitIndexByName(config.conditions[condition][key]);
                            ranks = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
                                .reduce(TotalRank, 0);
                        } else if (key === `value`) {
                            isValidMove = ranks >= config.conditions[condition][key];
                        }
                    }
                }
            }
        }
    }
    if (!isValidMove) {
        G.publicPlayers[Number(ctx.currentPlayer)].stack.splice(1);
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const PickHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    const isStartPickHero: boolean = IsStartActionStage(G, ctx, config);
    if (isStartPickHero) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен пикнуть героя.`);
    } else {
        if (config.stageName === undefined) {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.stageName'.`);
        }
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не стартовал стэйдж 'PickHero'.`);
    }
};
