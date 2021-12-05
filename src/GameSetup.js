import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { BuildCards, GetAverageSuitCard } from "./Card";
import { suitsConfig } from "./data/SuitData";
import { marketCoinsConfig } from "./data/CoinData";
import { BuildCoins } from "./Coin";
import { GetAllPicks, k_combinations, Permute } from "./BotConfig";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
import { actionCardsConfigArray } from "./data/ActionCardData";
import { BuildHeroes } from "./Hero";
import { BuildCampCards } from "./Camp";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
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
export var SetupGame = function (ctx) {
    var suitsNum = 5, tierToEnd = 2, campNum = 5, actionsNum = 0, log = true, debug = false, drawProfit = "", suitIdForMjollnir = null, expansions = {
        thingvellir: {
            active: true,
        },
    }, totalScore = [], logData = [], decks = [], discardCardsDeck = [], campDecks = [], distinctions = Array(suitsNum).fill(null);
    var winner = [], campPicked = false, camp = [], discardCampCardsDeck = [];
    if (expansions.thingvellir.active) {
        for (var i = 0; i < tierToEnd; i++) {
            // todo Camp cards must be hidden from users?
            campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            campDecks[i] = ctx.random.Shuffle(campDecks[i]);
        }
        camp = campDecks[0].splice(0, campNum);
    }
    for (var i = 0; i < tierToEnd; i++) {
        // todo Deck cards must be hidden from users?
        decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray
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
    var heroes = BuildHeroes(heroesConfigArray), taverns = [], tavernsNum = 3, currentTavern = -1, drawSize = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (var i = 0; i < tavernsNum; i++) {
        // todo Taverns cards must be hidden from users?
        taverns[i] = decks[0].splice(0, drawSize);
    }
    var players = {}, publicPlayers = [], publicPlayersOrder = [], exchangeOrder = [];
    var priorities = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers);
    for (var i = 0; i < ctx.numPlayers; i++) {
        var randomPriorityIndex = Math.floor(Math.random() * priorities.length), priority = priorities.splice(randomPriorityIndex, 1)[0];
        players[i] = BuildPlayer();
        publicPlayers[i] = BuildPublicPlayer(ctx.numPlayers, suitsNum, "Dan" + i, priority);
    }
    var marketCoinsUnique = [], marketCoins = BuildCoins(marketCoinsConfig, {
        count: marketCoinsUnique,
        players: ctx.numPlayers,
        isInitial: false,
        isTriggerTrading: false,
    });
    var averageCards = [], initHandCoinsId = Array(players[0].boardCoins.length).fill(undefined)
        .map(function (item, index) { return index; }), initCoinsOrder = k_combinations(initHandCoinsId, tavernsNum);
    var allCoinsOrder = [];
    for (var suit in suitsConfig) {
        averageCards[GetSuitIndexByName(suit)] = GetAverageSuitCard(suitsConfig[suit], {
            players: ctx.numPlayers,
            tier: 0
        });
    }
    for (var i = 0; i < initCoinsOrder.length; i++) {
        allCoinsOrder = allCoinsOrder.concat(Permute(initCoinsOrder[i]));
    }
    var botData = {
        allCoinsOrder: allCoinsOrder,
        allPicks: GetAllPicks({ tavernsNum: tavernsNum, playersNum: ctx.numPlayers }),
        maxIter: 1000,
        deckLength: decks[0].length,
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
        botData: botData,
    };
};
