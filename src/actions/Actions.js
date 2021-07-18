import {UpgradeCoin} from "../Coin";
import {INVALID_MOVE} from "boardgame.io/core";
import {suitsConfig} from "../data/SuitData";
import {AddCardToPlayer} from "../Player";
import {AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {CreateCard, DiscardCardFromTavern} from "../Card";
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
    StartVidofnirVedrfolnirAction, UpgradeCoinVidofnirVedrfolnirAction
} from "./CampActions";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {AddDataToLog} from "../Logging";
/**
 * Диспетчер действий при их активации.
 * Применения:
 * 1) При выборе конкретных героев выполняются последовательно их действия.
 * 2) При выборе конкретных карт кэмпа выполняются последовательно их действия.
 * 3) При выборе карт улучшения монет выполняются их действия.
 *
 * @param G
 * @param ctx
 * @param data Конфиг действий.
 * @param args Дополнительные аргументы.
 * @returns {*} Вызов действия.
 * @constructor
 */
export const ActionDispatcher = (G, ctx, data, ...args) => {
    let action;
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
    return action?.(G, ctx, data.config, ...args);
};

/**
 * Действия, связанные с улучшением монет.
 * Применения:
 * 1) При выборе конкретных героев, улучшающих монеты.
 * 2) При выборе карт улучшающих монеты.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 * @returns {*}
 * @constructor
 */
const UpgradeCoinAction = (G, ctx, config, ...args) => {
    UpgradeCoin(G, ctx, config, ...args);
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с отрисовкой профита.
 * Применения:
 * 1) При выборе конкретных героев, дающих профит.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
const DrawProfitAction = (G, ctx, config) => {
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} должен получить преимущества от 
    действия '${config.drawName}'.`);
    if (G.stack[ctx.currentPlayer][0].config?.stageName) {
        AddDataToLog(G, "game", `Начало фазы ${G.stack[ctx.currentPlayer][0].config.stageName}.`);
        ctx.events.setStage(G.stack[ctx.currentPlayer][0].config.stageName);
    }
    G.actionsNum = config.number ?? 1;
    G.drawProfit = config.name;
};

/**
 * Действия, связанные с добавлением бафов игроку.
 * Применения:
 * 1) При выборе конкретных героев, добавляющих бафы игроку.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {*}
 * @constructor
 */
const AddBuffToPlayer = (G, ctx, config) => {
    G.players[ctx.currentPlayer].buffs[config.buff.name] = config.buff.value;
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} получил баф '${config.buff.name}'.`);
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с дискардом карт с планшета игрока.
 * Применения:
 * 1) При выборе конкретных героев, дискардящих карты с планшета игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
export const DiscardCardsFromPlayerBoardAction = (G, ctx, config, suitId, cardId) => {
    G.players[ctx.currentPlayer].pickedCard = G.players[ctx.currentPlayer].cards[suitId][cardId];
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} отправил в сброс карту 
    ${G.players[ctx.currentPlayer].pickedCard.name}.`);
    G.discardCardsDeck.push(G.players[ctx.currentPlayer].cards[suitId].splice(cardId, 1)[0]);
    if (G.actionsNum === 2) {
        const stack = [
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
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Сбрасывает карту из таверны по выбору игрока.
 * Применения:
 * 1) Применяется при выборе первым игроком карты из кэмпа.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
const DiscardCardFromTavernAction = (G, ctx, config, cardId) => {
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} отправил в сброс карту из таверны:`);
    DiscardCardFromTavern(G, cardId);
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с возможностью дискарда карт с планшета игрока.
 * Применения:
 * 1) При выборе конкретных героев, дающих возможность дискарда карт с планшета игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {string} INVALID_MOVE
 * @returns {string|*}
 * @constructor
 */
const CheckDiscardCardsFromPlayerBoardAction = (G, ctx, config) => {
    const cardsToDiscard = [];
    for (let i = 0; i < G.suitsNum; i++) {
        if (config.suit !== Object.keys(suitsConfig)[i]) {
            const last = G.players[ctx.currentPlayer].cards[i].length - 1;
            if (last >= 0 && G.players[ctx.currentPlayer].cards[i][last].type !== "герой") {
                cardsToDiscard.push(G.players[ctx.currentPlayer].cards[i][last]);
            }
        }
    }
    const isValidMove = cardsToDiscard.length >= (config.number ?? 1);
    if (!isValidMove) {
        G.stack[ctx.currentPlayer].splice(1);
        return INVALID_MOVE;
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с добавлением других карт на планшет игрока.
 * Применения:
 * 1) При выборе конкретных героев, добавляющих другие карты на планшет игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
const PlaceCards = (G, ctx, config, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId],
        olwinDouble = CreateCard({
        suit,
        rank: G.stack[ctx.currentPlayer][0].variants[suit].rank,
        points: G.stack[ctx.currentPlayer][0].variants[suit].points,
        name: "Olwin",
    });
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} добавил карту Олвин во фракцию 
    ${suitsConfig[suit].suitName}.`);
    AddCardToPlayer(G, ctx, olwinDouble);
    if (G.actionsNum === 2) {
        const variants = {
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
            stack = [
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
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

/**
 * Действия, связанные с возможностью взятия карт из дискарда.
 * Применения:
 * 1) При выборе конкретных героев, дающих возможность взять карты из дискарда.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
const CheckPickDiscardCard = (G, ctx) => {
    if (G.discardCardsDeck.length === 0) {
        G.stack[ctx.currentPlayer].splice(1);
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с взятием карт из дискарда.
 * Применения:
 * 1) При выборе конкретных героев, дающих возможность взять карты из дискарда.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
const PickDiscardCard = (G, ctx, config, cardId) => {
    const isAdded = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]),
        pickedCard = G.discardCardsDeck.splice(cardId, 1)[0];
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} добавил карту ${pickedCard.name} 
    из дискарда.`);
    if (G.actionsNum === 2 && G.discardCardsDeck.length > 0) {
        const stack = [
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
    if (isAdded) {
        CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    const suitId = GetSuitIndexByName(pickedCard.suit);
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

/**
 * Первый игрок в фазе вербовки наёмников может пасануть, чтобы вербовать последним.
 * Применения:
 * 1) Может применятся первым игроком в фазе вербовки наёмников.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
const PassEnlistmentMercenariesAction = (G, ctx) => {
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} пасанул во время фазы 
    Enlistment Mercenaries.`);
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Игрок выбирает наёмника для вербовки.
 * 1) Применяется когда игроку нужно выбрать наёмника для вербовки.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
const GetEnlistmentMercenariesAction = (G, ctx, config, cardId) => {
    G.players[ctx.currentPlayer].pickedCard = G.players[ctx.currentPlayer].campCards
        .filter(card => card.type === "наёмник")[cardId];
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} во время фазы 
    Enlistment Mercenaries выбрал наёмника '${G.players[ctx.currentPlayer].pickedCard.name}'.`);
    const stack = [
        {
            actionName: "DrawProfitAction",
            config: {
                name: "placeEnlistmentMercenaries",
                drawName: "Place Enlistment Mercenaries",
            },
        },
    ];
    return EndActionFromStackAndAddNew(G, ctx, stack);
};

/**
 * Игрок выбирает фракцию для вербовки указанного наёмника.
 * 1) Применяется когда игроку нужно выбрать фракцию для вербовки наёмника.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
const PlaceEnlistmentMercenariesAction = (G, ctx, config, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId],
        mercenaryCard = CreateCard({
        type: "наёмник",
        suit,
        rank: 1,
        points: G.players[ctx.currentPlayer].pickedCard.stack[0].variants[suit].points,
        name: G.players[ctx.currentPlayer].pickedCard.name,
        tier: G.players[ctx.currentPlayer].pickedCard.tier,
        path: G.players[ctx.currentPlayer].pickedCard.path,
    });
    AddCardToPlayer(G, ctx, mercenaryCard);
    AddDataToLog(G, "game", `Игрок ${G.players[ctx.currentPlayer].nickname} во время фазы 
    Enlistment Mercenaries завербовал наёмника '${mercenaryCard.name}'.`);
    const cardIndex = G.players[ctx.currentPlayer].campCards.findIndex(card => card.name === G.players[ctx.currentPlayer].pickedCard.name);
    G.players[ctx.currentPlayer].campCards.splice(cardIndex, 1);
    if (G.players[ctx.currentPlayer].campCards.filter(card => card.type === "наёмник").length) {
        const stack = [
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
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};
