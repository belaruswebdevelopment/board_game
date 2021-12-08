import { suitsConfig } from "../data/SuitData";
import { CreateCard } from "../Card";
import { AddCardToPlayer, AddHeroCardToPlayerCards, AddHeroCardToPlayerHeroCards } from "../Player";
import { CheckPickHero } from "../Hero";
import { EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { ReturnCoinToPlayerHands } from "../Coin";
import { CheckAndMoveThrud, GetHeroIndexByName, StartThrudMoving } from "../helpers/HeroHelpers";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddDataToLog } from "../Logging";
import { TotalRank } from "../helpers/ScoreHelpers";
/**
 * <h3>Действия, связанные с проверкой расположением героя Труд на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровом поле игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @param {number} suitId Id фракции.
 * @constructor
 */
export var PlaceThrudAction = function (G, ctx, config, suitId) {
    var suit = Object.keys(suitsConfig)[suitId], playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants) {
        var thrudCard = CreateCard({
            suit: suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: "герой",
            name: "Thrud",
            game: "base",
        });
        AddDataToLog(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 \u0422\u0440\u0443\u0434 \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(suitsConfig[suit].suitName, "."));
        AddCardToPlayer(G, ctx, thrudCard);
        CheckPickHero(G, ctx);
        EndActionFromStackAndAddNew(G, ctx);
    }
};
/**
 * <h3>Действия, связанные с проверкой расположением героя Илуд на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @param {number} suitId Id фракции.
 * @constructor
 */
export var PlaceYludAction = function (G, ctx, config, suitId) {
    var suit = Object.keys(suitsConfig)[suitId], playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined) {
        var yludCard = CreateCard({
            suit: suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: "герой",
            name: "Ylud",
            game: "base",
        });
        AddDataToLog(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n        \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 \u0418\u043B\u0443\u0434 \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(suitsConfig[suit].suitName, "."));
        AddCardToPlayer(G, ctx, yludCard);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, yludCard);
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
    }
};
/**
 * <h3>Действия, связанные с проверкой перемещения героя Труд или выбора героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении карт, героев или карт кэмпа, помещающихся на карту героя Труд на игровом поле игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {ICard | IArtefactCampCard | IHero} card Карта, помещающаяся на карту героя Труд.
 * @constructor
 */
export var CheckAndMoveThrudOrPickHeroAction = function (G, ctx, card) {
    var isMoveThrud = CheckAndMoveThrud(G, ctx, card);
    if (isMoveThrud) {
        StartThrudMoving(G, ctx, card);
    }
    else {
        CheckPickHero(G, ctx);
    }
};
/**
 * <h3>Действия, связанные с добавлением героев в массив карт игрока.</li>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющихся в массив карт игрока.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @constructor
 */
export var AddHeroToCards = function (G, ctx, config) {
    if (config.drawName) {
        var heroIndex = GetHeroIndexByName(config.drawName), hero = G.heroes[heroIndex];
        var suitId = null;
        AddHeroCardToPlayerHeroCards(G, ctx, hero);
        if (hero.suit) {
            AddHeroCardToPlayerCards(G, ctx, hero);
            CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
            suitId = GetSuitIndexByName(hero.suit);
        }
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
    }
};
/**
 * <h3>Действия, связанные с возвращением закрытых монет со стола в руку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export var GetClosedCoinIntoPlayerHand = function (G, ctx) {
    var coinsCount = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length, tradingBoardCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex(function (coin) { return Boolean(coin && coin.isTriggerTrading); }), tradingHandCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
        .findIndex(function (coin) { return Boolean(coin && coin.isTriggerTrading); });
    for (var i = 0; i < coinsCount; i++) {
        if ((i < G.tavernsNum && G.currentTavern < i)
            || (i >= G.tavernsNum && tradingHandCoinIndex !== -1)
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IConfig} config Конфиг действий героя.
 * @returns {string | void}
 * @constructor
 */
export var PickHeroWithConditions = function (G, ctx, config) {
    var isValidMove = false;
    for (var condition in config.conditions) {
        if (config.conditions.hasOwnProperty(condition)) {
            if (condition === "suitCountMin") {
                var ranks = 0;
                for (var key in config.conditions[condition]) {
                    if (config.conditions[condition].hasOwnProperty(key)) {
                        if (key === "suit") {
                            var suitId = GetSuitIndexByName(config.conditions[condition][key]);
                            ranks = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].reduce(TotalRank, 0);
                        }
                        else if (key === "value") {
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export var PickHero = function (G, ctx) {
    var playerConfig = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (playerConfig !== undefined) {
        AddDataToLog(G, "game" /* GAME */, "\u041D\u0430\u0447\u0430\u043B\u043E \u0444\u0430\u0437\u044B ".concat(playerConfig.stageName, "."));
        ctx.events.setStage(playerConfig.stageName);
    }
};
