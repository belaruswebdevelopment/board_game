import {ReturnCoinToPlayerHands, UpgradeCoin} from "./Coin";
import {INVALID_MOVE} from "boardgame.io/core";
import {suitsConfig} from "./data/SuitData";
import {TotalRank} from "./Score";
import {
    AddCampCardToPlayer,
    AddCampCardToPlayerCards,
    AddHeroCardToPlayerCards,
    AddHeroCardToPlayerHeroCards
} from "./Player";
import {CheckPickHero} from "./Hero";
import {AfterBasicPickCardActions} from "./moves/Moves";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {GetHeroIndexByName} from "./helpers/HeroHelpers";

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
        case "AddCampCardToCards":
            action = AddCampCardToCards;
            break;
        case "RecruitHero":
            action = RecruitHero;
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
 * @constructor
 */
const UpgradeCoinAction = (G, ctx, config, ...args) => {
    G.actionsNum = config.number;
    G.actionsNum--;
    UpgradeCoin(G, ctx, config, ...args);
    if (!G.actionsNum) {
        G.actionsNum = null;
        CheckEndActions(G, ctx, config);
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
    if (config.name === "GridAction") {
        G.players[ctx.currentPlayer].pickedCard = config;
    }
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
    const heroIndex = GetHeroIndexByName(config.hero),
        hero = G.heroes[heroIndex];
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
    if (hero.suit) {
        AddHeroCardToPlayerCards(G, ctx, config, hero);
    } else {
        CheckEndActions(G, ctx, config);
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
    CheckEndActions(G, ctx, config);
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
    CheckEndActions(G, ctx, config);
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
                            const suitId = GetSuitIndexByName(config.conditions[condition][key]);
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
    CheckEndActions(G, ctx, config);
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
        CheckEndActions(G, ctx, config);
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
        G.actionsNum = config.number;
        G.drawProfit = config.name;
    } else {
        CheckEndActions(G, ctx, config);
    }
};

/**
 * Действия, связанные с добавлением карт кэмпа в конкретную фракцию игрока.
 * Применения:
 * 1) При выборе карт кэмпа, добавляющихся в конкретную фракцию игрока.
 *
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
export const AddCampCardToCards = (G, ctx, config) => {
    const campCardIndex = G.camp.findIndex(card => card?.name === config.card);
    const campCard = G.camp[campCardIndex];
    G.camp[campCardIndex] = null;
    G.campPicked = true;
    if (campCard.suit) {
        AddCampCardToPlayerCards(G, ctx, campCard, config);
    } else {
        AddCampCardToPlayer(G, ctx, campCard);
        CheckEndActions(G, ctx, config);
    }
};

/**
 * Действия, связанные с взятием героя.
 * Применения:
 * 1) При выборе карт кэмпа, дающих возможность взять карту героя.
 *
 * @param G
 * @param ctx
 * @constructor
 */
export const RecruitHero = (G, ctx) => {
    ctx.events.setStage("pickHero");
};

/**
 * Действия, связанные с активацией способности артефакта Vidofnir Vedrfolnir.
 * Применения:
 * 1) При выборе карт кэмпа артефакта Vidofnir Vedrfolnir.
 *
 * @param G
 * @param ctx
 * @constructor
 */
export const ActivateVidofnirVedrfolnirAction = (G, ctx) => {
    let coinsValue = 0;
    for (let j = G.tavernsNum; j < G.players[ctx.currentPlayer].boardCoins.length; j++) {
        if (G.players[ctx.currentPlayer].boardCoins[j] &&
            !G.players[ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
            coinsValue++;
        }
    }
    let action;
    if (coinsValue === 2) {
        action = {
            action: {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 2,
                    value: 3,
                },
            },
        };
    } else if (coinsValue === 1) {
        action = {
            action: {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 1,
                    value: 5,
                },
            },
        };
    }
    G.actionsNum = action.action.config.number;
    G.players[ctx.currentPlayer].pickedCard = action;
    G.drawProfit = "VidofnirVedrfolnirAction";
};

/**
 * Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.
 * Применения:
 * 1) При старте способности карты кэмпа артефакта Vidofnir Vedrfolnir.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
export const StartVidofnirVedrfolnirAction = (G, ctx, config) => {
    if (G.players[ctx.currentPlayer].buffs?.["everyTurn"] === "Uline") {
        G.drawProfit = config.name;
        G.actionsNum = G.players[ctx.currentPlayer].boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
    } else {
        ActivateVidofnirVedrfolnirAction(G, ctx);
    }
};

/**
 * Действия, связанные со сбросом обменной монеты.
 * Применения:
 * 1) При выборе карты кэмпа артефакта Jarnglofi.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
export const DiscardTradingCoin = (G, ctx, config) => {
    let tradingCoinIndex = G.players[ctx.currentPlayer].boardCoins.findIndex(coin => coin?.value === 0);
    if (G.players[ctx.currentPlayer].buffs?.["everyTurn"] === "Uline" && tradingCoinIndex === -1) {
        tradingCoinIndex = G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin?.value === 0);
        G.players[ctx.currentPlayer].handCoins.splice(tradingCoinIndex, 1, null);
    } else {
        G.players[ctx.currentPlayer].boardCoins.splice(tradingCoinIndex, 1, null);
    }
    CheckEndActions(G, ctx, config);
};

/**
 * Действия, связанные с дискардом карты из конфретной фракции игрока.
 * Применения:
 * 1) При выборе карты кэмпа артефакта Hofud.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
export const DiscardSuitCard = (G, ctx, config) => {
    const suitId = GetSuitIndexByName(config.suit),
        value = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (i !== Number(ctx.currentPlayer) && G.players[i].cards[suitId].length) {
            value[i] = "discardSuitCard";
        }
    }
    ctx.events.setActivePlayers({
        value,
        moveLimit: 1,
    });
    G.drawProfit = config.name;
};

/**
 * Завершение текущего экшена.
 * Применения:
 * 1) Срабатывает после завершения каждого экшена.
 *
 * @param G
 * @param ctx
 * @constructor
 */
export const EndAction = (G, ctx) => {
    G.drawProfit = null;
    if (CheckPickHero(G, ctx)) {
        ctx.events.endStage();
        ctx.events.setStage("pickHero");
    } else {
        ctx.events.endStage();
        AfterBasicPickCardActions(G, ctx);
    }
};

/**
 * Проверка закончились ли все действия, связанные с завершением текущего экшена.
 * Применения:
 * 1) После каждого выполнения действий, связанных с завершением текущего экшена.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @constructor
 */
export const CheckEndActions = (G, ctx, config) => {
    if (config.hero || config.card) {
        if (config.action) {
            ActionDispatcher(G, ctx, config.action);
        } else {
            EndAction(G, ctx);
        }
    }
};
