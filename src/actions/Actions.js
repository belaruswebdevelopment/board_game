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
    PlaceThrudAction, PlaceYludAction
} from "./HeroActions";
import {
    AddCampCardToCards,
    CheckPickCampCard,
    DiscardSuitCard,
    DiscardTradingCoin,
    StartVidofnirVedrfolnirAction
} from "./CampActions";
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
        case "StartVidofnirVedrfolnirAction":
            action = StartVidofnirVedrfolnirAction;
            break;
        case "DiscardTradingCoin":
            action = DiscardTradingCoin;
            break;
        case "DiscardSuitCard":
            action = DiscardSuitCard;
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
        G.actionsNum = null;
        return EndActionFromStackAndAddNew(G, ctx);
    }
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
    ctx.events.setStage(G.stack[ctx.currentPlayer][0].stack.config.stageName);
    G.players[ctx.currentPlayer].pickedCard = config;
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
    G.players[ctx.currentPlayer].pickedCard = {
        suit: suitId,
    };
    const suit = Object.keys(suitsConfig)[suitId];
    let points = 0;
    if (suit === "hunter" || suit === "blacksmith") {
        points = null;
    }
    const olwinDouble = CreateCard({
        suit: suit,
        rank: 1,
        points: points,
        name: "Olwin",
    });
    AddCardToPlayer(G, ctx, olwinDouble);
    if (G.actionsNum === 0) {
        G.drawProfit = null;
        G.actionsNum = null;
        CheckAndMoveThrudOrPickHeroAction(G, ctx, olwinDouble);
        return EndActionFromStackAndAddNew(G, ctx);
    }
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
        G.stack[ctx.currentPlayer].slice(1);
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
    if (isAdded) {
        CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
    } else {
        AddActionsToStackAfterCurrent(G, ctx, G.players[ctx.currentPlayer].pickedCard.stack);
    }
    if (G.actionsNum === 0) {
        G.drawProfit = null;
        G.actionsNum = null;
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

