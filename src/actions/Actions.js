import {UpgradeCoin} from "../Coin";
import {INVALID_MOVE} from "boardgame.io/core";
import {suitsConfig} from "../data/SuitData";
import {AddCardToPlayer} from "../Player";
import {AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {CreateCard} from "../Card";
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
    AddCampCardToCards, AddCoinToPouchAction,
    CheckPickCampCard,
    DiscardSuitCard,
    DiscardTradingCoin,
    StartVidofnirVedrfolnirAction
} from "./CampActions";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
// todo Add logging
/**
 * Диспетчер действий при их активаци.
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
        case "DiscardTradingCoin":
            action = DiscardTradingCoin;
            break;
        case "DiscardSuitCard":
            action = DiscardSuitCard;
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
    G.actionsNum = config.number;
    G.actionsNum--;
    UpgradeCoin(G, ctx, config, ...args);
    if (G.actionsNum === 0) {
        G.drawProfit = null;
        G.actionsNum = null;
    }
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
    if (G.stack[ctx.currentPlayer][0].stack.config.stageName) {
        ctx.events.setStage(G.stack[ctx.currentPlayer][0].stack.config.stageName);
    }
    G.actionsNum = config.number ?? null;
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
    ctx.events.setStage(G.stack[ctx.currentPlayer][0].stack.config.stageName);
    G.players[ctx.currentPlayer].pickedCard = G.players[ctx.currentPlayer].cards[suitId][cardId];
    G.discardCardsDeck.push(G.players[ctx.currentPlayer].cards[suitId].splice(cardId, 1)[0]);
    if (G.actionsNum === 0) {
        G.drawProfit = null;
        G.actionsNum = null;
        return EndActionFromStackAndAddNew(G, ctx);
    }
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
            if (G.players[ctx.currentPlayer].cards[i][last].type !== "герой") {
                cardsToDiscard.push(G.players[ctx.currentPlayer].cards[i][last]);
            }
        }
    }
    const isValidMove = cardsToDiscard.length >= config.number;
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
    ctx.events.setStage(G.stack[ctx.currentPlayer][0].stack.config.stageName);
    G.actionsNum--;
    const suit = Object.keys(suitsConfig)[suitId];
    let points = 0;
    if (suit === "hunter" || suit === "blacksmith") {
        points = null;
    }
    const olwinDouble = CreateCard({
        suit,
        rank: 1,
        points: points,
        name: "Olwin",
    });
    AddCardToPlayer(G, ctx, olwinDouble);
    if (G.actionsNum === 1) {
        const stack = [
            {
                stack: {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "placeCards",
                        stageName: "placeCards",
                        hero: "Olwin",
                        number: 1,
                    },
                },
            },
            {
                stack: {
                    actionName: "PlaceCards",
                    config: {
                        stageName: "placeCards",
                        hero: "Olwin",
                    },
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    if (G.actionsNum === 0 || G.stack[ctx.currentPlayer].length > 2) {
        G.drawProfit = null;
        G.actionsNum = null;
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
    ctx.events.setStage(G.stack[ctx.currentPlayer][0].stack.config.stageName);
    const isAdded = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]),
        pickedCard = G.discardCardsDeck.splice(cardId, 1)[0];
    if (G.actionsNum === 1 && G.discardCardsDeck.length > 0) {
        const stack = [
            {
                stack: {
                    actionName: "DrawProfitAction",
                    config: {
                        stageName: "pickDiscardCard",
                        card: "Brisingamens",
                        name: "BrisingamensAction",
                        number: 1,
                    },
                },
            },
            {
                stack: {
                    actionName: "PickDiscardCard",
                    config: {
                        stageName: "pickDiscardCard",
                        card: "Brisingamens",
                        name: "BrisingamensAction",
                        number: 1,
                    },
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    if (G.actionsNum === 0 || G.stack[ctx.currentPlayer].length > 2 || G.discardCardsDeck.length === 0) {
        G.drawProfit = null;
        G.actionsNum = null;
    }
    if (isAdded) {
        CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    if (G.actionsNum === null || G.stack[ctx.currentPlayer].length > 1) {
        const suitId = GetSuitIndexByName(pickedCard.suit);
        return EndActionFromStackAndAddNew(G, ctx, [], suitId);
    }
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
    ctx.playOrder.push(ctx.currentPlayer);
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Игрок выбирает наёмника для вербовки.
 * 1) Применяется когда игроку нужно выбрать наёмника для вербовки.
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 * @returns {*}
 * @constructor
 */
const GetEnlistmentMercenariesAction = (G, ctx, cardId) => {
    G.player[ctx.currentPlayer].pickedCard = G.players[ctx.currentPlayer].campCards.filter(card => card.type === "наёмник")[cardId];
    const stack = [
        {
            stack: {
                actionName: "DrawProfitAction",
                config: {
                    name: "placeEnlistmentMercenaries",
                },
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
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
const PlaceEnlistmentMercenariesAction = (G, ctx, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId];
    const mercenaryCard = CreateCard({
        type: "наёмник",
        suit,
        rank: 1,
        points: G.players[ctx.currentPlayer].pickedCard.suit.points,
        name: G.players[ctx.currentPlayer].pickedCard.name,
        tier: G.players[ctx.currentPlayer].pickedCard.tier,
        path: G.players[ctx.currentPlayer].pickedCard.path,
    });
    AddCardToPlayer(G, ctx, mercenaryCard);
    const cardIndex = G.players[ctx.currentPlayer].campCards.indexOf(G.players[ctx.currentPlayer].pickedCard);
    G.players[ctx.currentPlayer].campCards.splice(cardIndex, 1);
    if (G.players[ctx.currentPlayer].campCards.filter(card => card.type === "наёмник").length) {
        const stack = [
            {
                stack: {
                    actionName: "DrawProfitAction",
                    config: {
                        name: "enlistmentMercenaries",
                    },
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
    if (G.stack[ctx.currentPlayer].length > 2) {
        G.drawProfit = null;
    }
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};
