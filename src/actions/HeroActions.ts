import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { CreateCard } from "../Card";
import { ReturnCoinToPlayerHands } from "../Coin";
import { suitsConfig } from "../data/SuitData";
import { AddBuffToPlayer, DrawCurrentProfit, PickDiscardCard, UpgradeCurrentCoin } from "../helpers/ActionHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { AddHeroCardToPlayerHeroCards, AddHeroCardToPlayerCards } from "../helpers/HeroCardHelpers";
import { CheckAndMoveThrudOrPickHeroAction, CheckPickDiscardCard, CheckPickHero, GetHeroIndexByName } from "../helpers/HeroHelpers";
import { TotalRank } from "../helpers/ScoreHelpers";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { IConfig, IStack, IConditions, IVariants } from "../typescript/action_interfaces";
import { ICard, ICreateCard } from "../typescript/card_interfaces";
import { PlayerCardsType } from "../typescript/card_types";
import { CoinType } from "../typescript/coin_types";
import { ActionTypes, ConfigNames, DrawNames, HeroNames, LogTypes, RusCardTypes, Stages, SuitNames } from "../typescript/enums";
import { MyGameState } from "../typescript/game_data_interfaces";
import { IHero } from "../typescript/hero_card_interfaces";
import { ArgsTypes } from "../typescript/types";

// todo Does INVALID_MOVE be not in moves but in actions?
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
export const AddBuffToPlayerHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
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
        let suit: string | null = null;
        AddHeroCardToPlayerHeroCards(G, ctx, hero);
        AddHeroCardToPlayerCards(G, ctx, hero);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
        if (hero.suit !== null) {
            suit = hero.suit;
        }
        EndActionFromStackAndAddNew(G, ctx, [], suit);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.drawName'.`);
    }
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
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (config.suit !== suit) {
                const last: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                if (last >= 0
                    && G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !== RusCardTypes.HERO) {
                    cardsToDiscard.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last]);
                }
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
 * <h3>Действия, связанные с дискардом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дискардящих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G: MyGameState, ctx: Ctx, config: IConfig, suit: string,
    cardId: number): void => {
    const pickedCard: PlayerCardsType = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][cardId];
    if (pickedCard.type !== RusCardTypes.HERO) {
        G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = pickedCard;
        // todo Artefact cards can be added to discard too OR make artefact card as created ICard?
        G.discardCardsDeck.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
            .splice(cardId, 1)[0] as ICard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту ${pickedCard.name}.`);
        if (G.actionsNum === 2) {
            const stack: IStack[] = [
                {
                    action: {
                        name: DrawProfitHeroAction.name,
                        type: ActionTypes.Hero,
                    },
                    config: {
                        stageName: Stages.DiscardCardFromBoard,
                        drawName: DrawNames.Dagda,
                        name: ConfigNames.DagdaAction,
                        suit: SuitNames.HUNTER,
                    },
                },
                {
                    action: {
                        name: DiscardCardsFromPlayerBoardAction.name,
                        type: ActionTypes.Hero,
                    },
                    config: {
                        suit: SuitNames.HUNTER,
                    },
                },
            ];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        EndActionFromStackAndAddNew(G, ctx);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`);
    }
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
            .findIndex((coin: CoinType): boolean => Boolean(coin?.isTriggerTrading)),
        tradingHandCoinIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .findIndex((coin: CoinType): boolean => Boolean(coin?.isTriggerTrading));
    for (let i = 0; i < coinsCount; i++) {
        if ((i < G.tavernsNum && G.currentTavern < i) || (i >= G.tavernsNum && tradingHandCoinIndex !== -1)
            || (i >= G.tavernsNum && tradingBoardCoinIndex >= G.currentTavern)) {
            ReturnCoinToPlayerHands(G.publicPlayers[Number(ctx.currentPlayer)], i);
        }
    }
    EndActionFromStackAndAddNew(G, ctx);
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
    let isValidMove = false;
    for (const condition in config.conditions) {
        if (Object.prototype.hasOwnProperty.call(config.conditions, condition)) {
            if (condition === `suitCountMin`) {
                let ranks = 0;
                for (const key in (config.conditions as IConditions)[condition]) {
                    if (Object.prototype.hasOwnProperty.call(config.conditions[condition], key)) {
                        if (key === `suit`) {
                            ranks = G.publicPlayers[Number(ctx.currentPlayer)]
                                .cards[config.conditions[condition][key]].reduce(TotalRank, 0);
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
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих другие карты на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 */
export const PlaceCardsAction = (G: MyGameState, ctx: Ctx, config: IConfig, suit: string): void => {
    const playerVariants: IVariants | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined) {
        const olwinDouble: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            name: HeroNames.Olwin,
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
                        action: {
                            name: DrawProfitHeroAction.name,
                            type: ActionTypes.Hero,
                        },
                        variants,
                        config: {
                            name: ConfigNames.PlaceCards,
                            stageName: Stages.PlaceCards,
                            drawName: DrawNames.Olwin,
                        },
                    },
                    {
                        action: {
                            name: PlaceCardsAction.name,
                            type: ActionTypes.Hero,
                        },
                        variants,
                    },
                ];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        CheckAndMoveThrudOrPickHeroAction(G, ctx, olwinDouble);
        EndActionFromStackAndAddNew(G, ctx, [], suit);
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
 * @param suit Название фракции.
 */
export const PlaceHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig, suit: string): void => {
    const playerVariants: IVariants | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined && config.name !== undefined) {
        const heroCard: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: RusCardTypes.HERO,
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
