import {ReturnCoinToPlayerHands, UpgradeCoin} from "./Coin";
import {EndHeroAction} from "./Moves";
import {heroesConfig} from "./data/HeroData";
import {INVALID_MOVE} from "boardgame.io/core";
import {suitsConfig} from "./data/SuitData";
import {TotalRank} from "./Score";
import {AddHeroCardToPlayerCards, AddHeroCardToPlayerHeroCards} from "./Player";

/**
 * Диспетчер действий при их активаци.
 * Применения:
 * 1) При выборе конкретных героев выполняются последовательно их действия.
 * 2) При выборе карт улучшения монет выполняются их действия.
 *
 * @param G
 * @param ctx
 * @param data Конфиг действий героя.
 * @param args Дополнительные аргументы.
 * @returns {*} Вызов действия героя.
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
        case "DiscardCardsFromPlayerBoard":
            action = DiscardCardsFromPlayerBoard;
            break;
        case "PlaceCards":
            action = PlaceCards;
            break;
        case "PickCampCard":
            action = PickCampCard;
            break;
        case "PickDiscardCard":
            action = PickDiscardCard;
            break;
        case "GetClosedCoinIntoPlayerHand":
            action = GetClosedCoinIntoPlayerHand;
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
 * @constructor
 */
const UpgradeCoinAction = (G, ctx, config, ...args) => {
    UpgradeCoin(G, ctx, config, ...args);
    CheckEndHeroActions(G, ctx, config);
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
    G.drawProfit = config.name;
};

/**
 * Действия, связанные с добавлением героев в массив карт игрока.
 * Применения:
 * 1) При выборе конкретных героев, добавляющихся в массив карт игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
const AddHeroToCards = (G, ctx, config) => {
    const hero = G.heroes[Object.keys(heroesConfig).findIndex(hero => hero === config.hero)];
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
    if (hero.suit) {
        AddHeroCardToPlayerCards(G, ctx, config, hero);
    } else {
        CheckEndHeroActions(G, ctx, config);
    }
};

/**
 * Действия, связанные с добавлением бафов игроку.
 * Применения:
 * 1) При выборе конкретных героев, добавляющих бафы игроку.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
const AddBuffToPlayer = (G, ctx, config) => {
    G.players[ctx.currentPlayer].buffs[config.buff.name] = config.buff.value;
    CheckEndHeroActions(G, ctx, config);
};

const GetClosedCoinIntoPlayerHand = (G, ctx, config) => {
    const coinsCount = G.players[ctx.currentPlayer].boardCoins.length,
        tradingBoardCoinIndex = G.players[ctx.currentPlayer].boardCoins.findIndex(coin => coin?.isTriggerTrading),
        tradingHandCoinIndex = G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin?.isTriggerTrading);
    for (let i = 0; i < coinsCount; i++) {
        if ((i < G.tavernsNum && G.currentTavern < i) ||
            (i >= G.tavernsNum && tradingHandCoinIndex !== -1) ||
            (i >= G.tavernsNum && tradingBoardCoinIndex >= G.currentTavern)) {
            ReturnCoinToPlayerHands(G.players[ctx.currentPlayer], i);
        }
    }
    CheckEndHeroActions(G, ctx, config);
};

/**
 * Действия, связанные с выбором героев по определённым условиям.
 * Применения:
 * 1) При выборе конкретных героев, получаемых по определённым условиям.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {string} INVALID_MOVE
 * @constructor
 */
const PickHeroWithConditions = (G, ctx, config) => {
    let isValidMove = false;
    for (const condition in config.conditions) {
        if (config.conditions.hasOwnProperty(condition)) {
            if (condition === "suitCountMin") {
                let ranks = 0;
                for (const key in config.conditions[condition]) {
                    if (config.conditions[condition].hasOwnProperty(key)) {
                        if (key === "suit") {
                            const suitId = Object.keys(suitsConfig).findIndex(suit => suit === config.conditions[condition][key]);
                            ranks = G.players[ctx.currentPlayer].cards[suitId].reduce(TotalRank, 0);
                        } else if (key === "value") {
                            isValidMove = ranks >= config.conditions[condition][key];
                        }
                    }
                }
            }
        }
    }
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    CheckEndHeroActions(G, ctx, config);
};

/**
 * Действия, связанные с дискардом карт с планшета игрока.
 * Применения:
 * 1) При выборе конкретных героев, дискардящих карты с планшета игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {string} INVALID_MOVE
 * @constructor
 */
const DiscardCardsFromPlayerBoard = (G, ctx, config) => {
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
        return INVALID_MOVE;
    }
    G.actionsNum = config.number;
    G.drawProfit = config.name;
};

/**
 * Действия, связанные с добавлением других карт на планшет игрока.
 * Применения:
 * 1) При выборе конкретных героев, добавляющих другие карты на планшет игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
const PlaceCards = (G, ctx, config) => {
    G.actionsNum = config.number;
    G.drawProfit = config.name;
};

/**
 * Действия, связанные с взятием карт из кэмпа.
 * Применения:
 * 1) При выборе конкретных героев, дающих возможность взять карты из кэмпа.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
const PickCampCard = (G, ctx, config) => {
    if (G.camp.length) {
        G.drawProfit = config.name;
    } else {
        CheckEndHeroActions(G, ctx, config);
    }
};

/**
 * Действия, связанные с взятием карт из дискарда.
 * Применения:
 * 1) При выборе конкретных героев, дающих возможность взять карты из дискарда.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
const PickDiscardCard = (G, ctx, config) => {
    if (G.discardCardsDeck.length) {
        G.drawProfit = config.name;
    } else {
        CheckEndHeroActions(G, ctx, config);
    }
};

/**
 * Проверка закончились ли все действия, связанные с взятием героя.
 * Применения:
 * 1) После каждого выполнения действий, связанных с взятием конкретного героя.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
export const CheckEndHeroActions = (G, ctx, config) => {
    if (config.hero) {
        if (config.action) {
            ActionDispatcher(G, ctx, config.action);
        } else {
            EndHeroAction(G, ctx);
        }
    }
};
