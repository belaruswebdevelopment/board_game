import {EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {AddCampCardToPlayer, AddCampCardToPlayerCards} from "../Player";
import {CheckAndMoveThrudOrPickHeroAction} from "./HeroActions";

/**
 * Действия, связанные с возможностью взятия карт из кэмпа.
 * Применения:
 * 1) При выборе конкретных героев, дающих возможность взять карты из кэмпа.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
export const CheckPickCampCard = (G, ctx) => {
    if (G.camp.length === 0) {
        G.stack[ctx.currentPlayer].slice(1);
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с добавлением карт кэмпа в конкретную фракцию игрока.
 * Применения:
 * 1) При выборе карт кэмпа, добавляющихся в конкретную фракцию игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {*}
 * @constructor
 */
export const AddCampCardToCards = (G, ctx, config) => {
    const campCardIndex = G.camp.findIndex(card => card?.name === config.card);
    const campCard = G.camp[campCardIndex];
    G.camp[campCardIndex] = null;
    G.campPicked = true;
    if (campCard.suit) {
        AddCampCardToPlayerCards(G, ctx, campCard);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, campCard);
    } else {
        AddCampCardToPlayer(G, ctx, campCard);
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с активацией способности артефакта Vidofnir Vedrfolnir.
 * Применения:
 * 1) При выборе карт кэмпа артефакта Vidofnir Vedrfolnir.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
export const ActivateVidofnirVedrfolnirAction = (G, ctx) => {
    ctx.setStage(G.stack[ctx.currentPlayer][0].actionName.toLowerCase());
    let coinsValue = 0;
    for (let j = G.tavernsNum; j < G.players[ctx.currentPlayer].boardCoins.length; j++) {
        if (G.players[ctx.currentPlayer].boardCoins[j] &&
            !G.players[ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
            coinsValue++;
        }
    }
    let stack;
    if (coinsValue === 2) {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 2,
                    value: 3,
                },
            },
        ];
    } else if (coinsValue === 1) {
        stack = [
            {
                actionName: "UpgradeCoinAction",
                config: {
                    number: 1,
                    value: 5,
                },
            },
        ];
    }
    G.actionsNum = stack.config.number;
    G.players[ctx.currentPlayer].pickedCard = stack[0];
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
 * @returns {*}
 * @constructor
 */
export const StartVidofnirVedrfolnirAction = (G, ctx, config) => {
    if (G.players[ctx.currentPlayer].buffs?.["everyTurn"] === "Uline") {
        // todo CheckIT
        ctx.setStage(G.stack[ctx.currentPlayer][0].actionName.toLowerCase());
        G.drawProfit = config.name;
        G.actionsNum = G.players[ctx.currentPlayer].boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
    } else {
        ActivateVidofnirVedrfolnirAction(G, ctx);
    }
    // todo return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные со сбросом обменной монеты.
 * Применения:
 * 1) При выборе карты кэмпа артефакта Jarnglofi.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
export const DiscardTradingCoin = (G, ctx) => {
    // todo CheckIT
    ctx.setStage(G.stack[ctx.currentPlayer][0].actionName.toLowerCase());
    let tradingCoinIndex = G.players[ctx.currentPlayer].boardCoins.findIndex(coin => coin?.value === 0);
    if (G.players[ctx.currentPlayer].buffs?.["everyTurn"] === "Uline" && tradingCoinIndex === -1) {
        tradingCoinIndex = G.players[ctx.currentPlayer].handCoins.findIndex(coin => coin?.value === 0);
        G.players[ctx.currentPlayer].handCoins.splice(tradingCoinIndex, 1, null);
    } else {
        G.players[ctx.currentPlayer].boardCoins.splice(tradingCoinIndex, 1, null);
    }
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с дискардом карты из конфретной фракции игрока.
 * Применения:
 * 1) При выборе карты кэмпа артефакта Hofud.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {*}
 * @constructor
 */
export const DiscardSuitCard = (G, ctx, config) => {
    ctx.setStage(G.stack[ctx.currentPlayer][0].actionName.toLowerCase());
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
    // todo CHECK return EndActionFromStackAndAddNew(G, ctx);
};
