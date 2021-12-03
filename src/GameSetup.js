"use strict";
exports.__esModule = true;
exports.SetupGame = void 0;
var Player_1 = require("./Player");
var Card_1 = require("./Card");
var SuitData_1 = require("./data/SuitData");
var CoinData_1 = require("./data/CoinData");
var Coin_1 = require("./Coin");
var BotConfig_1 = require("./BotConfig");
var Priority_1 = require("./Priority");
var ActionCardData_1 = require("./data/ActionCardData");
var Hero_1 = require("./Hero");
var Camp_1 = require("./Camp");
var CampData_1 = require("./data/CampData");
var SuitHelpers_1 = require("./helpers/SuitHelpers");
/**
 * <h3>Сетап игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Данные используются в игре.</li>
 * </ol>
 *
 * @param ctx
 * @constructor
 */
var SetupGame = function (ctx) {
    var suitsNum = 5, tierToEnd = 2, campNum = 5, actionsNum = null, log = true, debug = false, drawProfit = null, suitIdForMjollnir = null, expansions = {
        thingvellir: {
            active: true
        }
    }, totalScore = [], logData = [], decks = [], discardCardsDeck = [], campDecks = [], distinctions = Array(suitsNum).fill(null);
    var winner = null, campPicked = false, camp = [], discardCampCardsDeck = [];
    if (expansions.thingvellir.active) {
        for (var i = 0; i < tierToEnd; i++) {
            // todo Camp cards must be hidden from users?
            campDecks[i] = (0, Camp_1.BuildCampCards)(i, CampData_1.artefactsConfig, CampData_1.mercenariesConfig);
            campDecks[i] = ctx.random.Shuffle(campDecks[i]);
        }
        camp = campDecks[0].splice(0, campNum);
    }
    for (var i = 0; i < tierToEnd; i++) {
        // todo Deck cards must be hidden from users?
        decks[i] = (0, Card_1.BuildCards)({
            suits: SuitData_1.suitsConfig,
            actions: ActionCardData_1.actionCardsConfigArray
        }, {
            players: ctx.numPlayers,
            tier: i
        });
        decks[i] = ctx.random.Shuffle(decks[i]);
    }
    var heroesConfigArray = ["base"];
    for (var expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigArray.push(expansion);
        }
    }
    var heroes = (0, Hero_1.BuildHeroes)(heroesConfigArray), taverns = [], tavernsNum = 3, currentTavern = -1, drawSize = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (var i = 0; i < tavernsNum; i++) {
        // todo Taverns cards must be hidden from users?
        taverns[i] = decks[0].splice(0, drawSize);
    }
    var players = {}, publicPlayers = [], publicPlayersOrder = [], exchangeOrder = [];
    for (var i = 0; i < ctx.numPlayers; i++) {
        players[i] = (0, Player_1.BuildPlayer)();
        publicPlayers[i] = (0, Player_1.BuildPublicPlayer)(ctx.numPlayers, suitsNum, "Dan" + i);
    }
    (0, Priority_1.BuildPriorities)(ctx.numPlayers, publicPlayers);
    var marketCoinsUnique = [], marketCoins = (0, Coin_1.BuildCoins)(CoinData_1.marketCoinsConfig, {
        count: marketCoinsUnique,
        players: ctx.numPlayers,
        isInitial: false,
        isTriggerTrading: false
    });
    var averageCards = [], initHandCoinsId = Array(players[0].boardCoins.length).fill(undefined)
        .map(function (item, index) { return index; }), initCoinsOrder = (0, BotConfig_1.k_combinations)(initHandCoinsId, tavernsNum);
    var allCoinsOrder = [];
    for (var suit in SuitData_1.suitsConfig) {
        averageCards[(0, SuitHelpers_1.GetSuitIndexByName)(suit)] = (0, Card_1.GetAverageSuitCard)(SuitData_1.suitsConfig[suit], {
            players: ctx.numPlayers,
            tier: 0
        });
    }
    for (var i = 0; i < initCoinsOrder.length; i++) {
        allCoinsOrder = allCoinsOrder.concat((0, BotConfig_1.Permute)(initCoinsOrder[i]));
    }
    var botData = {
        allCoinsOrder: allCoinsOrder,
        allPicks: (0, BotConfig_1.GetAllPicks)({ tavernsNum: tavernsNum, playersNum: ctx.numPlayers }),
        maxIter: 1000,
        deckLength: decks[0].length
    };
    return {
        log: log,
        debug: debug,
        winner: winner,
        drawProfit: drawProfit,
        suitsNum: suitsNum,
        tierToEnd: tierToEnd,
        campNum: campNum,
        actionsNum: actionsNum,
        tavernsNum: tavernsNum,
        currentTavern: currentTavern,
        drawSize: drawSize,
        suitIdForMjollnir: suitIdForMjollnir,
        expansions: expansions,
        totalScore: totalScore,
        logData: logData,
        decks: decks,
        discardCardsDeck: discardCardsDeck,
        discardCampCardsDeck: discardCampCardsDeck,
        heroes: heroes,
        campDecks: campDecks,
        campPicked: campPicked,
        camp: camp,
        distinctions: distinctions,
        taverns: taverns,
        players: players,
        publicPlayers: publicPlayers,
        publicPlayersOrder: publicPlayersOrder,
        exchangeOrder: exchangeOrder,
        marketCoins: marketCoins,
        marketCoinsUnique: marketCoinsUnique,
        averageCards: averageCards,
        botData: botData
    };
};
exports.SetupGame = SetupGame;
