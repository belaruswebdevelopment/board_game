import { suitsConfig } from "../data/SuitData";
import { CreateCard } from "../Card";
import { AddCardToPlayer, AddHeroCardToPlayerCards, AddHeroCardToPlayerHeroCards } from "../Player";
import { CheckPickHero } from "../Hero";
import { EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { ReturnCoinToPlayerHands } from "../Coin";
import { CheckAndMoveThrudOrPickHeroAction, GetHeroIndexByName } from "../helpers/HeroHelpers";
import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { INVALID_MOVE } from "boardgame.io/core";
import { AddDataToLog, LogTypes } from "../Logging";
import { TotalRank } from "../helpers/ScoreHelpers";
import { IsStartActionStage } from "../helpers/ActionHelpers";
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
 * @param suitId Id фракции.
 */
export var PlaceHeroAction = function (G, ctx, config, suitId) {
    var suit = Object.keys(suitsConfig)[suitId], playerVariants = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined && config.name !== undefined) {
        var heroCard = CreateCard({
            suit: suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: "\u0433\u0435\u0440\u043E\u0439",
            name: config.name,
            game: "base",
        });
        AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u043A\u0430\u0440\u0442\u0443 ").concat(config.name, " \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(suitsConfig[suit].suitName, "."));
        AddCardToPlayer(G, ctx, heroCard);
        CheckPickHero(G, ctx);
        EndActionFromStackAndAddNew(G, ctx);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 'stack[0].variants' \u0438\u043B\u0438 \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 'stack[0].config.name'.");
    }
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
export var AddHeroToCardsAction = function (G, ctx, config) {
    if (config.drawName) {
        var heroIndex = GetHeroIndexByName(config.drawName), hero = G.heroes[heroIndex];
        var suitId = null;
        AddHeroCardToPlayerHeroCards(G, ctx, hero);
        AddHeroCardToPlayerCards(G, ctx, hero);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, hero);
        if (hero.suit !== null) {
            suitId = GetSuitIndexByName(hero.suit);
            if (suitId === -1) {
                AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u043D\u0435\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0430\u044F \u0444\u0440\u0430\u043A\u0446\u0438\u044F ".concat(hero.suit, "."));
            }
        }
        EndActionFromStackAndAddNew(G, ctx, [], suitId);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 'config.drawName'.");
    }
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
export var GetClosedCoinIntoPlayerHandAction = function (G, ctx) {
    var coinsCount = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length, tradingBoardCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
        .findIndex(function (coin) { return Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading); }), tradingHandCoinIndex = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
        .findIndex(function (coin) { return Boolean(coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading); });
    for (var i = 0; i < coinsCount; i++) {
        if ((i < G.tavernsNum && G.currentTavern < i) || (i >= G.tavernsNum && tradingHandCoinIndex !== -1)
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
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns
 */
export var PickHeroWithConditionsAction = function (G, ctx, config) {
    var isValidMove = false;
    for (var condition in config.conditions) {
        if (config.conditions.hasOwnProperty(condition)) {
            if (condition === "suitCountMin") {
                var ranks = 0;
                for (var key in config.conditions[condition]) {
                    if (config.conditions[condition].hasOwnProperty(key)) {
                        if (key === "suit") {
                            var suitId = GetSuitIndexByName(config.conditions[condition][key]);
                            ranks = G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId]
                                .reduce(TotalRank, 0);
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
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export var PickHeroAction = function (G, ctx, config) {
    var isStartPickHero = IsStartActionStage(G, ctx, config);
    if (isStartPickHero) {
        AddDataToLog(G, LogTypes.GAME, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u0438\u043A\u043D\u0443\u0442\u044C \u0433\u0435\u0440\u043E\u044F."));
    }
    else {
        if (config.stageName === undefined) {
            AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 'config.stageName'.");
        }
        AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u0430\u043B \u0441\u0442\u044D\u0439\u0434\u0436 'PickHero'.");
    }
};
