import {suitsConfig} from "../data/SuitData";
import {CreateCard} from "../Card";
import {AddCardToPlayer, AddHeroCardToPlayerCards, AddHeroCardToPlayerHeroCards} from "../Player";
import {CheckPickHero} from "../Hero";
import {EndActionFromStackAndAddNew} from "../helpers/StackHelpers";
import {ReturnCoinToPlayerHands} from "../Coin";
import {GetHeroIndexByName} from "../helpers/HeroHelpers";
import {CheckAndMoveThrud, StartThrudMoving} from "../moves/HeroMoves";
import {GetSuitIndexByName} from "../helpers/SuitHelpers";
import {TotalRank} from "../Score";
import {INVALID_MOVE} from "boardgame.io/core";

/**
 * Действия, связанные с проверкой расположением героя Труд на игровом поле игрока.
 * Применения:
 * 1) При добавлении героя Труд на игровом поле игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
export const PlaceThrudAction = (G, ctx, config, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId];
    const thrudCard = CreateCard({
        suit,
        rank: G.stack[0].variants[suit].rank,
        points: G.stack[0].variants[suit].points,
        type: "герой",
        name: "Thrud",
        game: "base",
    });
    AddCardToPlayer(G, ctx, thrudCard);
    CheckPickHero(G, ctx);
    G.drawProfit = null;
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с проверкой расположением героя Илуд на игровом поле игрока.
 * Применения:
 * 1) При добавлении героя Илуд на игровом поле игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suitId Id фракции.
 * @returns {*}
 * @constructor
 */
export const PlaceYludAction = (G, ctx, config, suitId) => {
    const suit = Object.keys(suitsConfig)[suitId];
    const yludCard = CreateCard({
        suit: suit,
        rank: G.stack[0].variants[suit].rank,
        points: G.stack[0].variants[suit].points,
        type: "герой",
        name: "Ylud",
        game: "base",
    });
    AddCardToPlayer(G, ctx, yludCard);
    CheckAndMoveThrudOrPickHeroAction(G, ctx, yludCard);
    G.drawProfit = null;
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

/**
 * Действия, связанные с проверкой перемещения героя Труд или выбора героя.
 * Применения:
 * 1) При добавлении карт, героев или карт кэмпа, помещающихся на карту героя Труд на игровом поле игрока.
 *
 * @param G
 * @param ctx
 * @param card Карта, помещющаяся на карту героя Труд.
 * @constructor
 */
export const CheckAndMoveThrudOrPickHeroAction = (G, ctx, card) => {
    const isMoveThrud = CheckAndMoveThrud(G, ctx, card);
    if (isMoveThrud) {
        StartThrudMoving(G, ctx, card);
    } else {
        CheckPickHero(G, ctx);
    }
};

/**
 * Действия, связанные с добавлением героев в массив карт игрока.
 * Применения:
 * 1) При выборе конкретных героев, добавляющихся в массив карт игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {*}
 * @constructor
 */
export const AddHeroToCards = (G, ctx, config) => {
    const heroIndex = GetHeroIndexByName(config.hero),
        hero = G.heroes[heroIndex];
    let suitId = null;
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
    if (hero.suit) {
        AddHeroCardToPlayerCards(G, ctx, hero);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
        suitId = GetSuitIndexByName(hero.suit);
    }
    return EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

/**
 * Действия, связанные с возвращением закрытых монет со стола в руку.
 * Применения:
 * 1) При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.
 *
 * @param G
 * @param ctx
 * @returns {*}
 * @constructor
 */
export const GetClosedCoinIntoPlayerHand = (G, ctx) => {
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
    return EndActionFromStackAndAddNew(G, ctx);
};

/**
 * Действия, связанные с выбором героев по определённым условиям.
 * Применения:
 * 1) При выборе конкретных героев, получаемых по определённым условиям.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns {string|*} INVALID_MOVE
 * @constructor
 */
export const PickHeroWithConditions = (G, ctx, config) => {
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
        G.stack[ctx.currentPlayer].splice(1);
        return INVALID_MOVE;
    }
    return EndActionFromStackAndAddNew(G, ctx);
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
export const PickHero = (G, ctx) => {
    ctx.events.setStage(G.stack[ctx.currentPlayer][0].config.stageName);
};
