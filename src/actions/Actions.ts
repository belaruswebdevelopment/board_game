import {UpgradeCoin} from "../Coin";
import {INVALID_MOVE} from "boardgame.io/core";
import {suitsConfig} from "../data/SuitData";
import {AddCardToPlayer, IConfig, IStack, PlayerCardsType} from "../Player";
import {AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {CreateCard, DiscardCardFromTavern, ICard, ICreateCard, isCardNotAction} from "../Card";
import {
    AddHeroToCards,
    CheckAndMoveThrudOrPickHeroAction,
    GetClosedCoinIntoPlayerHand,
    PickHero,
    PickHeroWithConditions,
    PlaceThrudAction,
    PlaceYludAction
} from "./HeroActions";
import {
    AddCampCardToCards,
    AddCoinToPouchAction,
    CheckPickCampCard,
    DiscardAnyCardFromPlayerBoard,
    DiscardSuitCard,
    DiscardTradingCoin,
    GetMjollnirProfitAction,
    StartDiscardSuitCard,
    StartVidofnirVedrfolnirAction,
    UpgradeCoinVidofnirVedrfolnirAction
} from "./CampActions";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {AddDataToLog, LogTypes} from "../Logging";
import {CampDeckCardTypes, DeckCardTypes, MyGameState} from "../GameSetup";
import {Ctx} from "boardgame.io";
import {isArtefactCard} from "../Camp";
import {IVariants} from "../data/HeroData";
import {IHero} from "../Hero";

// todo Check my types
export type ArgsTypes = (string | number | boolean | null | object)[]

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
 * @param data Конфиг действий.
 * @param args Дополнительные аргументы.
 * @constructor
 */
export const ActionDispatcher = (G: MyGameState, ctx: Ctx, data: IStack, ...args: ArgsTypes): void => {
    let action: Function | null;
    switch (data.actionName) {
        case "DrawProfitAction":
            action = DrawProfitAction;
            break;
        case "UpgradeCoinAction":
            action = UpgradeCoinAction;
            break;
        case "AddHeroToCards":
            action = AddHeroToCards;
            break;
        case "AddBuffToPlayer":
            action = AddBuffToPlayer;
            break;
        case "PickHeroWithConditions":
            action = PickHeroWithConditions;
            break;
        case "CheckDiscardCardsFromPlayerBoardAction":
            action = CheckDiscardCardsFromPlayerBoardAction;
            break;
        case "DiscardCardsFromPlayerBoardAction":
            action = DiscardCardsFromPlayerBoardAction;
            break;
        case "DiscardCardFromTavernAction":
            action = DiscardCardFromTavernAction;
            break;
        case "PlaceCards":
            action = PlaceCards;
            break;
        case "CheckPickCampCard":
            action = CheckPickCampCard;
            break;
        case "CheckPickDiscardCard":
            action = CheckPickDiscardCard;
            break;
        case "PickDiscardCard":
            action = PickDiscardCard;
            break;
        case "GetClosedCoinIntoPlayerHand":
            action = GetClosedCoinIntoPlayerHand;
            break;
        case "PlaceThrudAction":
            action = PlaceThrudAction;
            break;
        case "PlaceYludAction":
            action = PlaceYludAction;
            break;
        case "AddCampCardToCards":
            action = AddCampCardToCards;
            break;
        case "PickHero":
            action = PickHero;
            break;
        case "AddCoinToPouchAction":
            action = AddCoinToPouchAction;
            break;
        case "StartVidofnirVedrfolnirAction":
            action = StartVidofnirVedrfolnirAction;
            break;
        case "UpgradeCoinVidofnirVedrfolnirAction":
            action = UpgradeCoinVidofnirVedrfolnirAction;
            break;
        case "DiscardTradingCoin":
            action = DiscardTradingCoin;
            break;
        case "StartDiscardSuitCard":
            action = StartDiscardSuitCard;
            break;
        case "DiscardSuitCard":
            action = DiscardSuitCard;
            break;
        case "DiscardAnyCardFromPlayerBoard":
            action = DiscardAnyCardFromPlayerBoard;
            break;
        case "GetMjollnirProfitAction":
            action = GetMjollnirProfitAction;
            break;
        case "PassEnlistmentMercenariesAction":
            action = PassEnlistmentMercenariesAction;
            break;
        case "GetEnlistmentMercenariesAction":
            action = GetEnlistmentMercenariesAction;
            break;
        case "PlaceEnlistmentMercenariesAction":
            action = PlaceEnlistmentMercenariesAction;
            break;
        default:
            action = null;
    }
    action?.(G, ctx, data.config, ...args);
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
 * @constructor
 */
const UpgradeCoinAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
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
 * @constructor
 */
const DrawProfitAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    должен получить преимущества от действия '${config.drawName}'.`);
    const playerConfig: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (playerConfig && playerConfig.stageName) {
        AddDataToLog(G, LogTypes.GAME, `Начало фазы ${playerConfig.stageName}.`);
        ctx.events!.setStage!(playerConfig.stageName);
    }
    G.actionsNum = config.number ?? 1;
    if (config.name) {
        G.drawProfit = config.name;
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
 * @constructor
 */
const AddBuffToPlayer = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.buff) {
        G.publicPlayers[Number(ctx.currentPlayer)].buffs[config.buff.name] = config.buff.value;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
        получил баф '${config.buff.name}'.`);
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
 * @constructor
 */
export const DiscardCardsFromPlayerBoardAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number,
                                                  cardId: number): void => {
    const pickedCard: PlayerCardsType = G.publicPlayers[Number(ctx.currentPlayer)]
            .cards[suitId][cardId];
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = pickedCard;
    if (pickedCard) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
        отправил в сброс карту ${pickedCard.name}.`);
        G.discardCardsDeck.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
            .splice(cardId, 1)[0] as DeckCardTypes);
        if (G.actionsNum === 2) {
            const stack: IStack[] = [
                {
                    actionName: "DrawProfitAction",
                    config: {
                        stageName: "discardCardFromBoard",
                        drawName: "Dagda",
                        name: "DagdaAction",
                        suit: "hunter",
                    },
                },
                {
                    actionName: "DiscardCardsFromPlayerBoardAction",
                    config: {
                        suit: "hunter",
                    },
                },
            ];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        EndActionFromStackAndAddNew(G, ctx);
    }
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
 * @constructor
 */
const DiscardCardFromTavernAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    отправил в сброс карту из таверны:`);
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
 * @constructor
 */
const CheckDiscardCardsFromPlayerBoardAction = (G: MyGameState, ctx: Ctx, config: IConfig): string | void => {
    const cardsToDiscard = [];
    for (let i: number = 0; i < G.suitsNum; i++) {
        if (config.suit !== Object.keys(suitsConfig)[i]) {
            const last: number = G.publicPlayers[Number(ctx.currentPlayer)].cards[i].length - 1;
            if (last >= 0 && G.publicPlayers[Number(ctx.currentPlayer)].cards[i][last].type !== "герой") {
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
 * @constructor
 */
const PlaceCards = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    const playerVariants: IVariants | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants) {
        const suit: string = Object.keys(suitsConfig)[suitId],
            olwinDouble: ICard = CreateCard({
                suit,
                rank: playerVariants[suit].rank,
                points: playerVariants[suit].points,
                name: "Olwin",
            } as ICreateCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту 
        Олвин во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, olwinDouble);
        if (G.actionsNum === 2) {
            const variants: IVariants = {
                    blacksmith: {
                        suit: "blacksmith",
                        rank: 1,
                        points: null,
                    },
                    hunter: {
                        suit: "hunter",
                        rank: 1,
                        points: null,
                    },
                    explorer: {
                        suit: "explorer",
                        rank: 1,
                        points: 0,
                    },
                    warrior: {
                        suit: "warrior",
                        rank: 1,
                        points: 0,
                    },
                    miner: {
                        suit: "miner",
                        rank: 1,
                        points: 0,
                    },
                },
                stack: IStack[] = [
                    {
                        actionName: "DrawProfitAction",
                        variants,
                        config: {
                            name: "placeCards",
                            stageName: "placeCards",
                            drawName: "Olwin",
                        },
                    },
                    {
                        actionName: "PlaceCards",
                        variants,
                    },
                ];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        CheckAndMoveThrudOrPickHeroAction(G, ctx, olwinDouble);
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
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
 * @constructor
 */
const CheckPickDiscardCard = (G: MyGameState, ctx: Ctx): void => {
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
 * @constructor
 */
const PickDiscardCard = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    const isAdded: boolean = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]),
        pickedCard: DeckCardTypes = G.discardCardsDeck.splice(cardId, 1)[0];
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    добавил карту ${pickedCard.name} из дискарда.`);
    if (G.actionsNum === 2 && G.discardCardsDeck.length > 0) {
        const stack: IStack[] = [
            {
                actionName: "DrawProfitAction",
                config: {
                    stageName: "pickDiscardCard",
                    name: "BrisingamensAction",
                    drawName: "Brisingamens",
                },
            },
            {
                actionName: "PickDiscardCard",
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
        }
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    const suitId: number = GetSuitIndexByName((pickedCard as ICard).suit);
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
 * @constructor
 */
const PassEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    пасанул во время фазы Enlistment Mercenaries.`);
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
 * @constructor
 */
const GetEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].campCards
        .filter((card: CampDeckCardTypes): boolean => card.type === "наёмник")[cardId];
    const pickedCard: DeckCardTypes | CampDeckCardTypes | IHero | null =
        G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
        во время фазы Enlistment Mercenaries выбрал наёмника '${pickedCard.name}'.`);
        const stack: IStack[] = [
            {
                actionName: "DrawProfitAction",
                config: {
                    name: "placeEnlistmentMercenaries",
                    drawName: "Place Enlistment Mercenaries",
                },
            },
        ];
        EndActionFromStackAndAddNew(G, ctx, stack);
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
 * @constructor
 */
const PlaceEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    const suit: string = Object.keys(suitsConfig)[suitId],
        pickedCard: DeckCardTypes | CampDeckCardTypes | IHero | null =
            G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null && "stack" in pickedCard && "tier" in pickedCard && "path" in pickedCard &&
        pickedCard.stack[0].variants) {
        const mercenaryCard: ICard = CreateCard({
            type: "наёмник",
            suit,
            rank: 1,
            points: pickedCard.stack[0].variants[suit].points,
            name: pickedCard.name,
            tier: pickedCard.tier,
            path: pickedCard.path,
        } as ICreateCard);
        AddCardToPlayer(G, ctx, mercenaryCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
        во время фазы Enlistment Mercenaries завербовал наёмника '${mercenaryCard.name}'.`);
        const cardIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .findIndex(card => card.name === pickedCard.name);
        G.publicPlayers[Number(ctx.currentPlayer)].campCards.splice(cardIndex, 1);
        if (G.publicPlayers[Number(ctx.currentPlayer)].campCards.filter(card =>
            card.type === "наёмник").length) {
            const stack: IStack[] = [
                {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "enlistmentMercenaries",
                        drawName: "Enlistment Mercenaries",
                    },
                },
            ];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
    }
};
